"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSpeed;
  uniform float uIntensity;
  uniform float uPressIntensity;
  uniform float uFlowDirection;
  uniform float uWaveFrequency;
  uniform float uColorShift;
  uniform bool uMousePressed;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform vec3 uColor5;
  varying vec2 vUv;

  vec3 getColorFromPalette(float t) {
    t = fract(t);
    
    if (t < 0.2) {
      return mix(uColor1, uColor2, t * 5.0);
    } else if (t < 0.4) {
      return mix(uColor2, uColor3, (t - 0.2) * 5.0);
    } else if (t < 0.6) {
      return mix(uColor3, uColor4, (t - 0.4) * 5.0);
    } else if (t < 0.8) {
      return mix(uColor4, uColor5, (t - 0.6) * 5.0);
    } else {
      return mix(uColor5, uColor1, (t - 0.8) * 5.0);
    }
  }

  // Improved noise function
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouse = uMouse;
    
    // Distance from mouse
    float dist = distance(uv, mouse);
    
    // Create more complex, non-repetitive waves
    float time = uTime * uSpeed * 0.1;
    
    // Multiple wave layers with different frequencies and phases
    float wave1 = sin(uv.x * uWaveFrequency + time + uFlowDirection) * 0.5 + 0.5;
    float wave2 = cos(uv.y * uWaveFrequency * 1.3 + time * 0.8 - uFlowDirection * 0.7) * 0.5 + 0.5;
    float wave3 = sin((uv.x + uv.y) * uWaveFrequency * 0.7 + time * 1.2 + uFlowDirection * 0.5) * 0.5 + 0.5;
    float wave4 = cos((uv.x - uv.y) * uWaveFrequency * 0.9 + time * 0.6 - uFlowDirection * 1.2) * 0.5 + 0.5;
    
    // Add turbulence for more organic movement
    float turbulence1 = sin(uv.x * uWaveFrequency * 2.0 + time * 1.5) * cos(uv.y * uWaveFrequency * 1.5 + time * 0.9);
    float turbulence2 = cos(uv.x * uWaveFrequency * 1.7 + time * 0.7) * sin(uv.y * uWaveFrequency * 2.3 + time * 1.3);
    
    // Combine waves with turbulence
    float combined = (wave1 + wave2 + wave3 + wave4) / 4.0;
    combined += (turbulence1 + turbulence2) * 0.1;
    
    // Add flowing directional movement
    vec2 flowDir = vec2(cos(uFlowDirection), sin(uFlowDirection));
    float flow = sin(dot(uv, flowDir) * uWaveFrequency + time * 2.0) * 0.3;
    combined += flow;
    
    // Mouse influence with adjustable press intensity
    float mouseInfluence = 1.0 - smoothstep(0.0, 0.6, dist);
    if (uMousePressed) {
      mouseInfluence *= uPressIntensity;
    }
    
    // Create dynamic color position with more variation
    float colorPosition = combined * 0.5 + time * 0.3 + uColorShift + mouseInfluence * 0.8;
    
    // Add some noise-based color variation
    float noiseVariation = noise(uv * 10.0 + time * 0.5) * 0.2;
    colorPosition += noiseVariation;
    
    vec3 baseColor = getColorFromPalette(colorPosition);
    
    // Enhanced brightness calculation with scaled intensity
    float brightness = (0.3 + combined * 0.4 + mouseInfluence * 0.7) * (uIntensity * 0.2);
    
    // Apply distance falloff with better visibility
    brightness *= (1.0 - smoothstep(0.0, 0.8, dist)) * 0.9 + 0.4;
    
    vec3 color = baseColor * brightness;
    
    // Add subtle texture noise
    float textureNoise = noise(uv * 50.0) * 0.01;
    color += textureNoise;
    
    gl_FragColor = vec4(color, 1.0);
  }
`

interface GradientShaderProps {
  mouse: [number, number]
  mousePressed: boolean
  speed: number
  intensity: number
  pressIntensity: number
  flowDirection: number
  waveFrequency: number
  colorShift: number
  colorPalette: number[][]
}

export default function GradientShader({
  mouse,
  mousePressed,
  speed,
  intensity,
  pressIntensity,
  flowDirection,
  waveFrequency,
  colorShift,
  colorPalette,
}: GradientShaderProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)

  // Create uniforms object
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(mouse[0], mouse[1]) },
      uSpeed: { value: speed },
      uIntensity: { value: intensity },
      uPressIntensity: { value: pressIntensity },
      uFlowDirection: { value: flowDirection },
      uWaveFrequency: { value: waveFrequency },
      uColorShift: { value: colorShift },
      uMousePressed: { value: mousePressed },
      uColor1: { value: new THREE.Vector3(...colorPalette[0]) },
      uColor2: { value: new THREE.Vector3(...colorPalette[1]) },
      uColor3: { value: new THREE.Vector3(...colorPalette[2]) },
      uColor4: { value: new THREE.Vector3(...colorPalette[3]) },
      uColor5: { value: new THREE.Vector3(...colorPalette[4]) },
    }
  }, [])

  // Update uniforms when props change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uSpeed.value = speed
      materialRef.current.uniforms.uIntensity.value = intensity
      materialRef.current.uniforms.uPressIntensity.value = pressIntensity
      materialRef.current.uniforms.uFlowDirection.value = flowDirection
      materialRef.current.uniforms.uWaveFrequency.value = waveFrequency
      materialRef.current.uniforms.uColorShift.value = colorShift
      materialRef.current.uniforms.uMousePressed.value = mousePressed
      materialRef.current.uniforms.uColor1.value.set(...colorPalette[0])
      materialRef.current.uniforms.uColor2.value.set(...colorPalette[1])
      materialRef.current.uniforms.uColor3.value.set(...colorPalette[2])
      materialRef.current.uniforms.uColor4.value.set(...colorPalette[3])
      materialRef.current.uniforms.uColor5.value.set(...colorPalette[4])
    }
  }, [speed, intensity, pressIntensity, flowDirection, waveFrequency, colorShift, mousePressed, colorPalette])

  // Update mouse position and time in animation frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uMouse.value.set(mouse[0], mouse[1])
    }
  })

  return (
    <mesh ref={meshRef} scale={[2, 2, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

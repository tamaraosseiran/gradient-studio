"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check } from "lucide-react"

interface ExportPanelProps {
  isOpen: boolean
  onClose: () => void
  speed: number
  intensity: number
  pressIntensity: number
  flowDirection: number
  waveFrequency: number
  colorShift: number
  hoverRadius: number
  colorPalette: number[][]
}

export default function ExportPanel({
  isOpen,
  onClose,
  speed,
  intensity,
  pressIntensity,
  flowDirection,
  waveFrequency,
  colorShift,
  hoverRadius,
  colorPalette,
}: ExportPanelProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  const copyToClipboard = async (text: string, tab: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedTab(tab)
      setTimeout(() => setCopiedTab(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // Convert RGB array to hex
  const rgbToHex = (rgb: number[]): string => {
    const r = Math.round(rgb[0] * 255)
      .toString(16)
      .padStart(2, "0")
    const g = Math.round(rgb[1] * 255)
      .toString(16)
      .padStart(2, "0")
    const b = Math.round(rgb[2] * 255)
      .toString(16)
      .padStart(2, "0")
    return `#${r}${g}${b}`
  }

  // Generate CSS that matches the exact current implementation
  const generateCSS = () => {
    const baseOpacities = [0.15, 0.12, 0.1, 0.08, 0.06]
    const animationSpeeds = [2, 1.5, 1.8, 2.2, 1.3]
    const animationAmplitudes = [0.05, 0.04, 0.03, 0.02, 0.02]

    const pressOpacities = [0.3, 0.25, 0.2, 0.15, 0.1]
    const pressAnimationSpeeds = [2, 1.5, 1.8, 2.2, 1.3]
    const pressAnimationAmplitudes = [0.1, 0.08, 0.06, 0.05, 0.04]

    return `/* Dynamic Gradient CSS - Exact Match */
.dynamic-gradient {
  position: relative;
  min-height: 100vh;
  background: black;
  overflow: hidden;
  cursor: none;
}

/* Base gradient that follows mouse */
.dynamic-gradient::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: all 100ms ease-out;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
    rgba(${Math.round(colorPalette[0][0] * 255)}, ${Math.round(colorPalette[0][1] * 255)}, ${Math.round(colorPalette[0][2] * 255)}, calc(${baseOpacities[0]} + sin(var(--time, 0) * ${animationSpeeds[0]}) * ${animationAmplitudes[0]})) 0%,
    rgba(${Math.round(colorPalette[1][0] * 255)}, ${Math.round(colorPalette[1][1] * 255)}, ${Math.round(colorPalette[1][2] * 255)}, calc(${baseOpacities[1]} + sin(var(--time, 0) * ${animationSpeeds[1]}) * ${animationAmplitudes[1]})) 20%,
    rgba(${Math.round(colorPalette[2][0] * 255)}, ${Math.round(colorPalette[2][1] * 255)}, ${Math.round(colorPalette[2][2] * 255)}, calc(${baseOpacities[2]} + sin(var(--time, 0) * ${animationSpeeds[2]}) * ${animationAmplitudes[2]})) 40%,
    rgba(${Math.round(colorPalette[3][0] * 255)}, ${Math.round(colorPalette[3][1] * 255)}, ${Math.round(colorPalette[3][2] * 255)}, calc(${baseOpacities[3]} + sin(var(--time, 0) * ${animationSpeeds[3]}) * ${animationAmplitudes[3]})) 60%,
    rgba(${Math.round(colorPalette[4][0] * 255)}, ${Math.round(colorPalette[4][1] * 255)}, ${Math.round(colorPalette[4][2] * 255)}, calc(${baseOpacities[4]} + sin(var(--time, 0) * ${animationSpeeds[4]}) * ${animationAmplitudes[4]})) 80%,
    transparent 100%);
}

/* Enhanced effect when pressed */
.dynamic-gradient.pressed::after {
  content: '';
  position: absolute;
  left: var(--mouse-x, 50%);
  top: var(--mouse-y, 50%);
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle at center,
    rgba(${Math.round(colorPalette[0][0] * 255)}, ${Math.round(colorPalette[0][1] * 255)}, ${Math.round(colorPalette[0][2] * 255)}, calc(${pressOpacities[0]} + sin(var(--time, 0) * ${pressAnimationSpeeds[0]}) * ${pressAnimationAmplitudes[0]})) 0%,
    rgba(${Math.round(colorPalette[1][0] * 255)}, ${Math.round(colorPalette[1][1] * 255)}, ${Math.round(colorPalette[1][2] * 255)}, calc(${pressOpacities[1]} + sin(var(--time, 0) * ${pressAnimationSpeeds[1]}) * ${pressAnimationAmplitudes[1]})) 25%,
    rgba(${Math.round(colorPalette[2][0] * 255)}, ${Math.round(colorPalette[2][1] * 255)}, ${Math.round(colorPalette[2][2] * 255)}, calc(${pressOpacities[2]} + sin(var(--time, 0) * ${pressAnimationSpeeds[2]}) * ${pressAnimationAmplitudes[2]})) 45%,
    rgba(${Math.round(colorPalette[3][0] * 255)}, ${Math.round(colorPalette[3][1] * 255)}, ${Math.round(colorPalette[3][2] * 255)}, calc(${pressOpacities[3]} + sin(var(--time, 0) * ${pressAnimationSpeeds[3]}) * ${pressAnimationAmplitudes[3]})) 65%,
    rgba(${Math.round(colorPalette[4][0] * 255)}, ${Math.round(colorPalette[4][1] * 255)}, ${Math.round(colorPalette[4][2] * 255)}, calc(${pressOpacities[4]} + sin(var(--time, 0) * ${pressAnimationSpeeds[4]}) * ${pressAnimationAmplitudes[4]})) 80%,
    transparent 95%);
  border-radius: 50%;
  filter: blur(30px);
  pointer-events: none;
}

/* Custom cursor */
.dynamic-gradient .cursor {
  position: absolute;
  left: var(--mouse-x, 50%);
  top: var(--mouse-y, 50%);
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.4);
  pointer-events: none;
  z-index: 50;
  transition: transform 0.1s ease-out, background-color 0.1s ease-out, border-color 0.1s ease-out;
}

.dynamic-gradient.pressed .cursor {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
  transform: translate(-50%, -50%) scale(1.5);
}

/* JavaScript to update CSS custom properties */
/*
document.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--mouse-x', (e.clientX / window.innerWidth * 100) + '%');
  document.documentElement.style.setProperty('--mouse-y', (e.clientY / window.innerHeight * 100) + '%');
});

document.addEventListener('mousedown', () => {
  document.querySelector('.dynamic-gradient').classList.add('pressed');
});

document.addEventListener('mouseup', () => {
  document.querySelector('.dynamic-gradient').classList.remove('pressed');
});

// Animation time update
let time = 0;
function animate() {
  time += 0.02;
  document.documentElement.style.setProperty('--time', time);
  requestAnimationFrame(animate);
}
animate();
*/`
  }

  // Generate SVG
  const generateSVG = () => {
    const colors = colorPalette
      .map((color, index) => {
        const hex = rgbToHex(color)
        const offset = (index / (colorPalette.length - 1)) * 100
        return `<stop offset="${offset}%" stopColor="${hex}" />`
      })
      .join("\n    ")

    return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="dynamicGradient" cx="50%" cy="50%" r="70%">
      ${colors}
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#dynamicGradient)" />
</svg>`
  }

  // Generate React Component that exactly matches current implementation
  const generateReact = () => {
    return `import React, { useState, useEffect, useCallback, useRef } from 'react';

const DynamicGradient = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isClient, setIsClient] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const animationRef = useRef();
  const timeRef = useRef(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setMousePosition({ x, y });
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  // Smooth animation loop
  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.02;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isClient) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [handleMouseMove, handleMouseDown, handleMouseUp, isClient]);

  if (!isClient) {
    return <div style={{ minHeight: '100vh', background: 'black' }} />;
  }

  const time = timeRef.current;

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: 'black',
      cursor: 'none'
    }}>
      {/* Always visible background gradient that follows mouse */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          transition: 'all 100ms ease-out',
          background: \`radial-gradient(circle at \${mousePosition.x}% \${mousePosition.y}%, 
            rgba(${Math.round(colorPalette[0][0] * 255)}, ${Math.round(colorPalette[0][1] * 255)}, ${Math.round(colorPalette[0][2] * 255)}, \${${0.15} + Math.sin(time * ${2}) * ${0.05}}) 0%,
            rgba(${Math.round(colorPalette[1][0] * 255)}, ${Math.round(colorPalette[1][1] * 255)}, ${Math.round(colorPalette[1][2] * 255)}, \${${0.12} + Math.sin(time * ${1.5}) * ${0.04}}) 20%, 
            rgba(${Math.round(colorPalette[2][0] * 255)}, ${Math.round(colorPalette[2][1] * 255)}, ${Math.round(colorPalette[2][2] * 255)}, \${${0.1} + Math.sin(time * ${1.8}) * ${0.03}}) 40%, 
            rgba(${Math.round(colorPalette[3][0] * 255)}, ${Math.round(colorPalette[3][1] * 255)}, ${Math.round(colorPalette[3][2] * 255)}, \${${0.08} + Math.sin(time * ${2.2}) * ${0.02}}) 60%, 
            rgba(${Math.round(colorPalette[4][0] * 255)}, ${Math.round(colorPalette[4][1] * 255)}, ${Math.round(colorPalette[4][2] * 255)}, \${${0.06} + Math.sin(time * ${1.3}) * ${0.02}}) 80%, 
            transparent 100%)\`,
        }}
      />

      {/* Enhanced effect when pressed */}
      {isPressed && (
        <>
          {/* Main gradient ooze from cursor */}
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              left: \`\${mousePosition.x}%\`,
              top: \`\${mousePosition.y}%\`,
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              background: \`radial-gradient(circle at center, 
                rgba(${Math.round(colorPalette[0][0] * 255)}, ${Math.round(colorPalette[0][1] * 255)}, ${Math.round(colorPalette[0][2] * 255)}, \${${0.3} + Math.sin(time * ${2}) * ${0.1}}) 0%,
                rgba(${Math.round(colorPalette[1][0] * 255)}, ${Math.round(colorPalette[1][1] * 255)}, ${Math.round(colorPalette[1][2] * 255)}, \${${0.25} + Math.sin(time * ${1.5}) * ${0.08}}) 25%, 
                rgba(${Math.round(colorPalette[2][0] * 255)}, ${Math.round(colorPalette[2][1] * 255)}, ${Math.round(colorPalette[2][2] * 255)}, \${${0.2} + Math.sin(time * ${1.8}) * ${0.06}}) 45%, 
                rgba(${Math.round(colorPalette[3][0] * 255)}, ${Math.round(colorPalette[3][1] * 255)}, ${Math.round(colorPalette[3][2] * 255)}, \${${0.15} + Math.sin(time * ${2.2}) * ${0.05}}) 65%, 
                rgba(${Math.round(colorPalette[4][0] * 255)}, ${Math.round(colorPalette[4][1] * 255)}, ${Math.round(colorPalette[4][2] * 255)}, \${${0.1} + Math.sin(time * ${1.3}) * ${0.04}}) 80%, 
                transparent 95%)\`,
              borderRadius: '50%',
              filter: 'blur(30px)',
            }}
          />

          {/* Secondary layer */}
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              left: \`\${mousePosition.x}%\`,
              top: \`\${mousePosition.y}%\`,
              transform: 'translate(-50%, -50%)',
              width: '250px',
              height: '250px',
              background: \`radial-gradient(circle at center, 
                rgba(${Math.round(colorPalette[1][0] * 255)}, ${Math.round(colorPalette[1][1] * 255)}, ${Math.round(colorPalette[1][2] * 255)}, \${${0.4} + Math.sin(time * ${2.5}) * ${0.1}}) 0%,
                rgba(${Math.round(colorPalette[2][0] * 255)}, ${Math.round(colorPalette[2][1] * 255)}, ${Math.round(colorPalette[2][2] * 255)}, \${${0.3} + Math.sin(time * ${1.7}) * ${0.08}}) 35%, 
                rgba(${Math.round(colorPalette[3][0] * 255)}, ${Math.round(colorPalette[3][1] * 255)}, ${Math.round(colorPalette[3][2] * 255)}, \${${0.2} + Math.sin(time * ${2.1}) * ${0.06}}) 60%, 
                transparent 85%)\`,
              borderRadius: '50%',
              filter: 'blur(20px)',
            }}
          />

          {/* Floating particles */}
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.3)',
              filter: 'blur(2px)',
              left: \`\${mousePosition.x + Math.sin(time * 3) * 4}%\`,
              top: \`\${mousePosition.y + Math.cos(time * 3) * 4}%\`,
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'rgba(168, 85, 247, 0.25)',
              filter: 'blur(2px)',
              left: \`\${mousePosition.x + Math.sin(time * 2.5 + 1) * 5}%\`,
              top: \`\${mousePosition.y + Math.cos(time * 2.5 + 1) * 5}%\`,
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'rgba(236, 72, 153, 0.2)',
              filter: 'blur(2px)',
              left: \`\${mousePosition.x + Math.sin(time * 3.5 + 2) * 6}%\`,
              top: \`\${mousePosition.y + Math.cos(time * 3.5 + 2) * 6}%\`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </>
      )}

      {/* Content area */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '48rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1.5rem'
          }}>
            Interactive Gradient
          </h1>
          <p style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
            color: '#9ca3af',
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            Move your cursor around to see the gradient follow. Press and drag for enhanced effects.
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            <span>X: {Math.round(mousePosition.x)}%</span>
            <span>•</span>
            <span>Y: {Math.round(mousePosition.y)}%</span>
            <span>•</span>
            <span style={{ color: isPressed ? '#34d399' : '#f87171' }}>
              {isPressed ? 'PAINTING' : 'HOVER'}
            </span>
          </div>
        </div>
      </div>

      {/* Custom cursor */}
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          zIndex: 50,
          left: \`\${mousePosition.x}%\`,
          top: \`\${mousePosition.y}%\`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            border: \`2px solid \${isPressed ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)'}\`,
            background: \${isPressed ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.4)'},
            boxShadow: isPressed ? '0 0 20px rgba(168, 85, 247, 0.3)' : 'none',
            transform: \`scale(\${isPressed ? 1.5 : 1})\`,
            transition: 'transform 0.1s ease-out, background-color 0.1s ease-out, border-color 0.1s ease-out',
          }}
        />
      </div>
    </div>
  );
};

export default DynamicGradient;`
  }

  // Generate Framer Override Component that exactly matches current implementation
  const generateFramer = () => {
    return `import type { ComponentType } from "react"
import { useState, useEffect, useCallback, useRef } from "react"

// Framer Override for Dynamic Gradient
export function withDynamicGradient(Component: ComponentType<any>): ComponentType<any> {
  return (props: any) => {
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
    const [isClient, setIsClient] = useState(false)
    const [isPressed, setIsPressed] = useState(false)
    const animationRef = useRef<number>()
    const timeRef = useRef(0)

    useEffect(() => {
      setIsClient(true)
    }, [])

    const handleMouseMove = useCallback((e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }, [])

    const handleMouseDown = useCallback(() => {
      setIsPressed(true)
    }, [])

    const handleMouseUp = useCallback(() => {
      setIsPressed(false)
    }, [])

    // Smooth animation loop
    useEffect(() => {
      const animate = () => {
        timeRef.current += 0.02
        animationRef.current = requestAnimationFrame(animate)
      }

      animate()

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }, [])

    useEffect(() => {
      if (isClient) {
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mousedown", handleMouseDown)
        window.addEventListener("mouseup", handleMouseUp)
        return () => {
          window.removeEventListener("mousemove", handleMouseMove)
          window.removeEventListener("mousedown", handleMouseDown)
          window.removeEventListener("mouseup", handleMouseUp)
        }
      }
    }, [handleMouseMove, handleMouseDown, handleMouseUp, isClient])

    if (!isClient) {
      return (
        <Component 
          {...props} 
          style={{ 
            ...props.style, 
            background: 'black',
            width: '100%',
            height: '100%'
          }} 
        />
      )
    }

    const time = timeRef.current

    return (
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'black',
          cursor: 'none',
          width: '100%',
          height: '100%',
          ...props.style,
        }}
      >
        {/* Always visible background gradient that follows mouse */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            transition: 'all 100ms ease-out',
            background: \`radial-gradient(circle at \${mousePosition.x}% \${mousePosition.y}%, 
              rgba(${Math.round(colorPalette[0][0] * 255)}, ${Math.round(colorPalette[0][1] * 255)}, ${Math.round(colorPalette[0][2] * 255)}, \${${0.15} + Math.sin(time * ${2}) * ${0.05}}) 0%,
              rgba(${Math.round(colorPalette[1][0] * 255)}, ${Math.round(colorPalette[1][1] * 255)}, ${Math.round(colorPalette[1][2] * 255)}, \${${0.12} + Math.sin(time * ${1.5}) * ${0.04}}) 20%, 
              rgba(${Math.round(colorPalette[2][0] * 255)}, ${Math.round(colorPalette[2][1] * 255)}, ${Math.round(colorPalette[2][2] * 255)}, \${${0.1} + Math.sin(time * ${1.8}) * ${0.03}}) 40%, 
              rgba(${Math.round(colorPalette[3][0] * 255)}, ${Math.round(colorPalette[3][1] * 255)}, ${Math.round(colorPalette[3][2] * 255)}, \${${0.08} + Math.sin(time * ${2.2}) * ${0.02}}) 60%, 
              rgba(${Math.round(colorPalette[4][0] * 255)}, ${Math.round(colorPalette[4][1] * 255)}, ${Math.round(colorPalette[4][2] * 255)}, \${${0.06} + Math.sin(time * ${1.3}) * ${0.02}}) 80%, 
              transparent 100%)\`,
          }}
        />

        {/* Enhanced effect when pressed */}
        {isPressed && (
          <>
            {/* Main gradient ooze from cursor */}
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                left: \`\${mousePosition.x}%\`,
                top: \`\${mousePosition.y}%\`,
                transform: 'translate(-50%, -50%)',
                width: 400,
                height: 400,
                background: \`radial-gradient(circle at center, 
                  rgba(${Math.round(colorPalette[0][0] * 255)}, ${Math.round(colorPalette[0][1] * 255)}, ${Math.round(colorPalette[0][2] * 255)}, \${${0.3} + Math.sin(time * ${2}) * ${0.1}}) 0%,
                  rgba(${Math.round(colorPalette[1][0] * 255)}, ${Math.round(colorPalette[1][1] * 255)}, ${Math.round(colorPalette[1][2] * 255)}, \${${0.25} + Math.sin(time * ${1.5}) * ${0.08}}) 25%, 
                  rgba(${Math.round(colorPalette[2][0] * 255)}, ${Math.round(colorPalette[2][1] * 255)}, ${Math.round(colorPalette[2][2] * 255)}, \${${0.2} + Math.sin(time * ${1.8}) * ${0.06}}) 45%, 
                  rgba(${Math.round(colorPalette[3][0] * 255)}, ${Math.round(colorPalette[3][1] * 255)}, ${Math.round(colorPalette[3][2] * 255)}, \${${0.15} + Math.sin(time * ${2.2}) * ${0.05}}) 65%, 
                  rgba(${Math.round(colorPalette[4][0] * 255)}, ${Math.round(colorPalette[4][1] * 255)}, ${Math.round(colorPalette[4][2] * 255)}, \${${0.1} + Math.sin(time * ${1.3}) * ${0.04}}) 80%, 
                  transparent 95%)\`,
                borderRadius: '50%',
                filter: 'blur(30px)',
              }}
            />

            {/* Secondary layer */}
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                left: \`\${mousePosition.x}%\`,
                top: \`\${mousePosition.y}%\`,
                transform: 'translate(-50%, -50%)',
                width: 250,
                height: 250,
                background: \`radial-gradient(circle at center, 
                  rgba(${Math.round(colorPalette[1][0] * 255)}, ${Math.round(colorPalette[1][1] * 255)}, ${Math.round(colorPalette[1][2] * 255)}, \${${0.4} + Math.sin(time * ${2.5}) * ${0.1}}) 0%,
                  rgba(${Math.round(colorPalette[2][0] * 255)}, ${Math.round(colorPalette[2][1] * 255)}, ${Math.round(colorPalette[2][2] * 255)}, \${${0.3} + Math.sin(time * ${1.7}) * ${0.08}}) 35%, 
                  rgba(${Math.round(colorPalette[3][0] * 255)}, ${Math.round(colorPalette[3][1] * 255)}, ${Math.round(colorPalette[3][2] * 255)}, \${${0.2} + Math.sin(time * ${2.1}) * ${0.06}}) 60%, 
                  transparent 85%)\`,
                borderRadius: '50%',
                filter: 'blur(20px)',
              }}
            />

            {/* Floating particles */}
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.3)',
                filter: 'blur(2px)',
                left: \`\${mousePosition.x + Math.sin(time * 3) * 4}%\`,
                top: \`\${mousePosition.y + Math.cos(time * 3) * 4}%\`,
                transform: 'translate(-50%, -50%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'rgba(168, 85, 247, 0.25)',
                filter: 'blur(2px)',
                left: \`\${mousePosition.x + Math.sin(time * 2.5 + 1) * 5}%\`,
                top: \`\${mousePosition.y + Math.cos(time * 2.5 + 1) * 5}%\`,
                transform: 'translate(-50%, -50%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'rgba(236, 72, 153, 0.2)',
                filter: 'blur(2px)',
                left: \`\${mousePosition.x + Math.sin(time * 3.5 + 2) * 6}%\`,
                top: \`\${mousePosition.y + Math.cos(time * 3.5 + 2) * 6}%\`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </>
        )}

        {/* Original component content */}
        <Component {...props} style={{ position: 'relative', zIndex: 10 }} />

        {/* Custom cursor */}
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 50,
            left: \`\${mousePosition.x}%\`,
            top: \`\${mousePosition.y}%\`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              border: \`2px solid \${isPressed ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)'}\`,
              background: isPressed ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.4)',
              boxShadow: isPressed ? '0 0 20px rgba(168, 85, 247, 0.3)' : 'none',
              transform: \`scale(\${isPressed ? 1.5 : 1})\`,
              transition: 'transform 0.1s ease-out, background-color 0.1s ease-out, border-color 0.1s ease-out',
            }}
          />
        </div>
      </div>
    )
  }
}

// Simple override function for Framer (recommended approach)
export default function DynamicGradientOverride(props: any) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isClient, setIsClient] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 100
    const y = (e.clientY / window.innerHeight) * 100
    setMousePosition({ x, y })
  }, [])

  const handleMouseDown = useCallback(() => {
    setIsPressed(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsPressed(false)
  }, [])

  // Smooth animation loop
  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.02
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mousedown", handleMouseDown)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mousedown", handleMouseDown)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [handleMouseMove, handleMouseDown, handleMouseUp, isClient])

  if (!isClient) {
    return {
      ...props,
      style: { 
        ...props.style, 
        background: 'black',
        cursor: 'none'
      }
    }
  }

  const time = timeRef.current

  return {
    ...props,
    style: {
      ...props.style,
      position: 'relative',
      overflow: 'hidden',
      background: 'black',
      cursor: 'none',
    },
    children: (
      <>
        {/* Always visible background gradient that follows mouse */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            transition: 'all 100ms ease-out',
            background: \`radial-gradient(circle at \${mousePosition.x}% \${mousePosition.y}%, 
              rgba(${Math.round(colorPalette[0][0] * 255)}, ${Math.round(colorPalette[0][1] * 255)}, ${Math.round(colorPalette[0][2] * 255)}, \${${0.15} + Math.sin(time * ${2}) * ${0.05}}) 0%,
              rgba(${Math.round(colorPalette[1][0] * 255)}, ${Math.round(colorPalette[1][1] * 255)}, ${Math.round(colorPalette[1][2] * 255)}, \${${0.12} + Math.sin(time * ${1.5}) * ${0.04}}) 20%, 
              rgba(${Math.round(colorPalette[2][0] * 255)}, ${Math.round(colorPalette[2][1] * 255)}, ${Math.round(colorPalette[2][2] * 255)}, \${${0.1} + Math.sin(time * ${1.8}) * ${0.03}}) 40%, 
              rgba(${Math.round(colorPalette[3][0] * 255)}, ${Math.round(colorPalette[3][1] * 255)}, ${Math.round(colorPalette[3][2] * 255)}, \${${0.08} + Math.sin(time * ${2.2}) * ${0.02}}) 60%, 
              rgba(${Math.round(colorPalette[4][0] * 255)}, ${Math.round(colorPalette[4][1] * 255)}, ${Math.round(colorPalette[4][2] * 255)}, \${${0.06} + Math.sin(time * ${1.3}) * ${0.02}}) 80%, 
              transparent 100%)\`,
          }}
        />

        {/* Enhanced effect when pressed */}
        {isPressed && (
          <>
            {/* Main gradient ooze from cursor */}
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                left: \`\${mousePosition.x}%\`,
                top: \`\${mousePosition.y}%\`,
                transform: 'translate(-50%, -50%)',
                width: 400,
                height: 400,
                background: \`radial-gradient(circle at center, 
                  rgba(${Math.round(colorPalette[0][0] * 255)}, ${Math.round(colorPalette[0][1] * 255)}, ${Math.round(colorPalette[0][2] * 255)}, \${${0.3} + Math.sin(time * ${2}) * ${0.1}}) 0%,
                  rgba(${Math.round(colorPalette[1][0] * 255)}, ${Math.round(colorPalette[1][1] * 255)}, ${Math.round(colorPalette[1][2] * 255)}, \${${0.25} + Math.sin(time * ${1.5}) * ${0.08}}) 25%, 
                  rgba(${Math.round(colorPalette[2][0] * 255)}, ${Math.round(colorPalette[2][1] * 255)}, ${Math.round(colorPalette[2][2] * 255)}, \${${0.2} + Math.sin(time * ${1.8}) * ${0.06}}) 45%, 
                  rgba(${Math.round(colorPalette[3][0] * 255)}, ${Math.round(colorPalette[3][1] * 255)}, ${Math.round(colorPalette[3][2] * 255)}, \${${0.15} + Math.sin(time * ${2.2}) * ${0.05}}) 65%, 
                  rgba(${Math.round(colorPalette[4][0] * 255)}, ${Math.round(colorPalette[4][1] * 255)}, ${Math.round(colorPalette[4][2] * 255)}, \${${0.1} + Math.sin(time * ${1.3}) * ${0.04}}) 80%, 
                  transparent 95%)\`,
                borderRadius: '50%',
                filter: 'blur(30px)',
              }}
            />

            {/* Secondary layer */}
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                left: \`\${mousePosition.x}%\`,
                top: \`\${mousePosition.y}%\`,
                transform: 'translate(-50%, -50%)',
                width: 250,
                height: 250,
                background: \`radial-gradient(circle at center, 
                  rgba(${Math.round(colorPalette[1][0] * 255)}, ${Math.round(colorPalette[1][1] * 255)}, ${Math.round(colorPalette[1][2] * 255)}, \${${0.4} + Math.sin(time * ${2.5}) * ${0.1}}) 0%,
                  rgba(${Math.round(colorPalette[2][0] * 255)}, ${Math.round(colorPalette[2][1] * 255)}, ${Math.round(colorPalette[2][2] * 255)}, \${${0.3} + Math.sin(time * ${1.7}) * ${0.08}}) 35%, 
                  rgba(${Math.round(colorPalette[3][0] * 255)}, ${Math.round(colorPalette[3][1] * 255)}, ${Math.round(colorPalette[3][2] * 255)}, \${${0.2} + Math.sin(time * ${2.1}) * ${0.06}}) 60%, 
                  transparent 85%)\`,
                borderRadius: '50%',
                filter: 'blur(20px)',
              }}
            />

            {/* Floating particles */}
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.3)',
                filter: 'blur(2px)',
                left: \`\${mousePosition.x + Math.sin(time * 3) * 4}%\`,
                top: \`\${mousePosition.y + Math.cos(time * 3) * 4}%\`,
                transform: 'translate(-50%, -50%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'rgba(168, 85, 247, 0.25)',
                filter: 'blur(2px)',
                left: \`\${mousePosition.x + Math.sin(time * 2.5 + 1) * 5}%\`,
                top: \`\${mousePosition.y + Math.cos(time * 2.5 + 1) * 5}%\`,
                transform: 'translate(-50%, -50%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'rgba(236, 72, 153, 0.2)',
                filter: 'blur(2px)',
                left: \`\${mousePosition.x + Math.sin(time * 3.5 + 2) * 6}%\`,
                top: \`\${mousePosition.y + Math.cos(time * 3.5 + 2) * 6}%\`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </>
        )}

        {/* Original content */}
        {props.children}

        {/* Custom cursor */}
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 50,
            left: \`\${mousePosition.x}%\`,
            top: \`\${mousePosition.y}%\`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              border: \`2px solid \${isPressed ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)'}\`,
              background: isPressed ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.4)',
              boxShadow: isPressed ? '0 0 20px rgba(168, 85, 247, 0.3)' : 'none',
              transform: \`scale(\${isPressed ? 1.5 : 1})\`,
              transition: 'transform 0.1s ease-out, background-color 0.1s ease-out, border-color 0.1s ease-out',
            }}
          />
        </div>
      </>
    )
  }
}

// Usage Instructions:
// 1. Copy this code into a new Code Override in Framer
// 2. Apply the default export "DynamicGradientOverride" to any Frame
// 3. The Frame will get the dynamic gradient background
// 4. Make sure the Frame has width and height set`
  }

  // Generate Configuration
  const generateConfig = () => {
    return JSON.stringify(
      {
        speed,
        intensity,
        pressIntensity,
        flowDirection,
        waveFrequency,
        colorShift,
        hoverRadius,
        colorPalette: colorPalette.map(rgbToHex),
        settings: {
          speed: { min: 0, max: 10, step: 0.5 },
          intensity: { min: 0, max: 10, step: 0.5 },
          pressIntensity: { min: 0, max: 10, step: 0.5 },
          flowDirection: { min: 0, max: 6.28, step: 0.1 },
          waveFrequency: { min: 0, max: 10, step: 0.5 },
          colorShift: { min: 0, max: 6.28, step: 0.1 },
          hoverRadius: { min: 0.1, max: 2.0, step: 0.1 },
        },
      },
      null,
      2,
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[80vh] overflow-hidden bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Export Gradient</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="css" className="w-full min-w-0">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 border border-gray-600">
            <TabsTrigger
              value="css"
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300 hover:text-white"
            >
              CSS
            </TabsTrigger>
            <TabsTrigger
              value="svg"
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300 hover:text-white"
            >
              SVG
            </TabsTrigger>
            <TabsTrigger
              value="react"
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300 hover:text-white"
            >
              React
            </TabsTrigger>
            <TabsTrigger
              value="framer"
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300 hover:text-white"
            >
              Framer
            </TabsTrigger>
            <TabsTrigger
              value="config"
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300 hover:text-white"
            >
              Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="css" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">CSS Implementation</h3>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(generateCSS(), "css")}
                  className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-500"
                >
                  {copiedTab === "css" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 border border-gray-600 max-w-full whitespace-pre-wrap break-words">
                <code className="block max-w-full">{generateCSS()}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="svg" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">SVG Export</h3>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(generateSVG(), "svg")}
                  className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-500"
                >
                  {copiedTab === "svg" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 border border-gray-600 max-w-full whitespace-pre-wrap break-words">
                <code className="block max-w-full">{generateSVG()}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="react" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">React Component</h3>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(generateReact(), "react")}
                  className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-500"
                >
                  {copiedTab === "react" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 border border-gray-600 max-w-full whitespace-pre-wrap break-words">
                <code className="block max-w-full">{generateReact()}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="framer" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Framer Override</h3>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(generateFramer(), "framer")}
                  className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-500"
                >
                  {copiedTab === "framer" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 border border-gray-600 max-w-full whitespace-pre-wrap break-words">
                <code className="block max-w-full">{generateFramer()}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="config" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Configuration JSON</h3>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(generateConfig(), "config")}
                  className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-500"
                >
                  {copiedTab === "config" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 border border-gray-600 max-w-full whitespace-pre-wrap break-words">
                <code className="block max-w-full">{generateConfig()}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

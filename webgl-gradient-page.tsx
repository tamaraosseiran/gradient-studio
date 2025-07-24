"use client"

import type React from "react"
import { useState, useCallback, useRef, Suspense, useEffect } from "react"
import dynamic from "next/dynamic"
import { Canvas } from "@react-three/fiber"
import { COLOR_PALETTES, getRandomPalette, generateHarmoniousPalette } from "./color-palettes"
import ControlsPanel from "./controls-panel"
import ExportButton from "./export-button"
import FallbackGradient from "./fallback-gradient"

// Dynamically import the GradientShader component with no SSR
const GradientShader = dynamic(() => import("./gradient-shader"), {
  ssr: false,
})

export default function WebGLGradientPage() {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null)
  const [mouse, setMouse] = useState<[number, number]>([0.5, 0.5])
  const [mousePressed, setMousePressed] = useState(false)
  const [speed, setSpeed] = useState(5.0)
  const [intensity, setIntensity] = useState(4.0)
  const [pressIntensity, setPressIntensity] = useState(5.0)
  const [flowDirection, setFlowDirection] = useState(0)
  const [waveFrequency, setWaveFrequency] = useState(5.0)
  const [colorShift, setColorShift] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const [currentPalette, setCurrentPalette] = useState("Sunset Dreams")
  const [colorPalette, setColorPalette] = useState(COLOR_PALETTES["Sunset Dreams"])

  // Check if WebGL is supported
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setWebGLSupported(!!gl)
    } catch (e) {
      setWebGLSupported(false)
    }
  }, [])

  const handlePaletteChange = useCallback((paletteName: string) => {
    setCurrentPalette(paletteName)
    setColorPalette(COLOR_PALETTES[paletteName as keyof typeof COLOR_PALETTES])
  }, [])

  const handleCustomPaletteChange = useCallback((palette: number[][]) => {
    setColorPalette(palette)
    setCurrentPalette("Custom")
  }, [])

  const handleShufflePalette = useCallback(() => {
    const newPalette = getRandomPalette()
    setColorPalette(newPalette)
    const paletteName =
      Object.entries(COLOR_PALETTES).find(
        ([_, palette]) => JSON.stringify(palette) === JSON.stringify(newPalette),
      )?.[0] || "Custom"
    setCurrentPalette(paletteName)
  }, [])

  const handleRandomPalette = useCallback(() => {
    const newPalette = generateHarmoniousPalette()
    setColorPalette(newPalette)
    setCurrentPalette("Custom Generated")
  }, [])

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = 1 - (event.clientY - rect.top) / rect.height
      setMouse([x, y])
    }
  }, [])

  const handleMouseDown = useCallback(() => {
    setMousePressed(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setMousePressed(false)
  }, [])

  const handleReset = useCallback(() => {
    setSpeed(5.0)
    setIntensity(4.0)
    setPressIntensity(5.0)
    setFlowDirection(0)
    setWaveFrequency(5.0)
    setColorShift(0)
    setMouse([0.5, 0.5])
    setMousePressed(false)
    setCurrentPalette("Sunset Dreams")
    setColorPalette(COLOR_PALETTES["Sunset Dreams"])
  }, [])

  // If WebGL is not supported, use the fallback gradient
  if (webGLSupported === false) {
    return <FallbackGradient />
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-screen relative bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ cursor: "none" }}
    >
      <Suspense fallback={<FallbackGradient />}>
        <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: true, alpha: false }}>
          <GradientShader
            mouse={mouse}
            mousePressed={mousePressed}
            speed={isPlaying ? speed : 0}
            intensity={intensity}
            pressIntensity={1 + (pressIntensity / 10) * 1.5}
            flowDirection={flowDirection}
            waveFrequency={waveFrequency}
            colorShift={colorShift}
            colorPalette={colorPalette}
          />
        </Canvas>
      </Suspense>

      {/* Controls Panel */}
      <ControlsPanel
        speed={speed}
        setSpeed={setSpeed}
        intensity={intensity}
        setIntensity={setIntensity}
        pressIntensity={pressIntensity}
        setPressIntensity={setPressIntensity}
        flowDirection={flowDirection}
        setFlowDirection={setFlowDirection}
        waveFrequency={waveFrequency}
        setWaveFrequency={setWaveFrequency}
        colorShift={colorShift}
        setColorShift={setColorShift}
        onReset={handleReset}
        currentPalette={currentPalette}
        colorPalette={colorPalette}
        onPaletteChange={handlePaletteChange}
        onCustomPaletteChange={handleCustomPaletteChange}
        onShufflePalette={handleShufflePalette}
        onRandomPalette={handleRandomPalette}
        palettes={COLOR_PALETTES}
      />

      {/* Floating Export Button */}
      <ExportButton
        colorPalette={colorPalette}
        speed={speed}
        intensity={intensity}
        pressIntensity={pressIntensity}
        flowDirection={flowDirection}
        waveFrequency={waveFrequency}
        colorShift={colorShift}
        currentPalette={currentPalette}
      />

      {/* Custom cursor */}
      <div
        className="absolute pointer-events-none z-20 w-2 h-2 bg-white/60 rounded-full border border-white/80"
        style={{
          left: `${mouse[0] * 100}%`,
          top: `${(1 - mouse[1]) * 100}%`,
          transform: "translate(-50%, -50%)",
          boxShadow: mousePressed ? "0 0 20px rgba(255,255,255,0.5)" : "none",
          scale: mousePressed ? "1.5" : "1",
          transition: "scale 0.1s ease-out, box-shadow 0.1s ease-out",
        }}
      />
    </div>
  )
}

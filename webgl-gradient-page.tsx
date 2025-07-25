"use client"

import type React from "react"

import { Suspense, useState, useCallback, useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import GradientShader from "./gradient-shader"
import ControlsPanel from "./controls-panel"
import ExportButton from "./export-button"
import FallbackGradient from "./fallback-gradient"
import { COLOR_PALETTES } from "./color-palettes"

export default function WebGLGradientPage() {
  const [mouse, setMouse] = useState<[number, number]>([0.5, 0.5])
  const [mousePressed, setMousePressed] = useState(false)
  const [speed, setSpeed] = useState(2.0)
  const [intensity, setIntensity] = useState(4.0)
  const [pressIntensity, setPressIntensity] = useState(5.0)
  const [flowDirection, setFlowDirection] = useState(0.0)
  const [waveFrequency, setWaveFrequency] = useState(3.0)
  const [colorShift, setColorShift] = useState(0.0)
  const [hoverRadius, setHoverRadius] = useState(0.6)
  const [currentPalette, setCurrentPalette] = useState("Sunset Dreams")
  const [colorPalette, setColorPalette] = useState(COLOR_PALETTES["Sunset Dreams"])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = 1 - (event.clientY - rect.top) / rect.height // Flip Y coordinate for WebGL
      setMouse([Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y))])
    }
  }, [])

  const handleMouseDown = useCallback(() => {
    setMousePressed(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setMousePressed(false)
  }, [])

  const handlePaletteChange = useCallback((paletteName: string) => {
    setCurrentPalette(paletteName)
    setColorPalette(COLOR_PALETTES[paletteName as keyof typeof COLOR_PALETTES])
  }, [])

  const handleCustomPaletteChange = useCallback((newPalette: number[][]) => {
    setColorPalette(newPalette)
    setCurrentPalette("Custom")
  }, [])

  const handleShufflePalette = useCallback(() => {
    const shuffled = [...colorPalette].sort(() => Math.random() - 0.5)
    setColorPalette(shuffled)
    setCurrentPalette("Custom")
  }, [colorPalette])

  const handleRandomPalette = useCallback(() => {
    const randomPalette = Array.from({ length: 5 }, () => [Math.random(), Math.random(), Math.random()])
    setColorPalette(randomPalette)
    setCurrentPalette("Custom")
  }, [])

  const handleReset = useCallback(() => {
    setSpeed(2.0)
    setIntensity(4.0)
    setPressIntensity(5.0)
    setFlowDirection(0.0)
    setWaveFrequency(3.0)
    setColorShift(0.0)
    setHoverRadius(0.6)
    setCurrentPalette("Sunset Dreams")
    setColorPalette(COLOR_PALETTES["Sunset Dreams"])
  }, [])

  // Global mouse event listeners for mouse up
  useEffect(() => {
    const handleGlobalMouseUp = () => setMousePressed(false)
    document.addEventListener("mouseup", handleGlobalMouseUp)
    return () => document.removeEventListener("mouseup", handleGlobalMouseUp)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-black cursor-none overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ cursor: "none" }}
    >
      <Suspense fallback={<FallbackGradient />}>
        <Canvas
          className="w-full h-full"
          style={{ width: "100vw", height: "100vh" }}
          camera={{ position: [0, 0, 1] }}
          gl={{ antialias: true, alpha: false }}
        >
          <GradientShader
            mouse={mouse}
            mousePressed={mousePressed}
            speed={speed}
            intensity={intensity}
            pressIntensity={pressIntensity}
            flowDirection={flowDirection}
            waveFrequency={waveFrequency}
            colorShift={colorShift}
            hoverRadius={hoverRadius}
            colorPalette={colorPalette}
          />
        </Canvas>
      </Suspense>

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
        hoverRadius={hoverRadius}
        setHoverRadius={setHoverRadius}
        onReset={handleReset}
        currentPalette={currentPalette}
        colorPalette={colorPalette}
        onPaletteChange={handlePaletteChange}
        onCustomPaletteChange={handleCustomPaletteChange}
        onShufflePalette={handleShufflePalette}
        onRandomPalette={handleRandomPalette}
        palettes={COLOR_PALETTES}
      />

      <ExportButton
        speed={speed}
        intensity={intensity}
        pressIntensity={pressIntensity}
        flowDirection={flowDirection}
        waveFrequency={waveFrequency}
        colorShift={colorShift}
        hoverRadius={hoverRadius}
        colorPalette={colorPalette}
      />
    </div>
  )
}

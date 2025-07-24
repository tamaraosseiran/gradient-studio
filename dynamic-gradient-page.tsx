"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export default function Component() {
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

    animate() // Always animate, not just when pressed

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
    return <div className="min-h-screen bg-black" />
  }

  const time = timeRef.current

  return (
    <div className="min-h-screen relative overflow-hidden bg-black cursor-none">
      {/* Always visible background gradient that follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-100 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(99, 102, 241, ${0.15 + Math.sin(time * 2) * 0.05}) 0%,
            rgba(168, 85, 247, ${0.12 + Math.sin(time * 1.5) * 0.04}) 20%, 
            rgba(236, 72, 153, ${0.1 + Math.sin(time * 1.8) * 0.03}) 40%, 
            rgba(251, 146, 60, ${0.08 + Math.sin(time * 2.2) * 0.02}) 60%, 
            rgba(34, 197, 94, ${0.06 + Math.sin(time * 1.3) * 0.02}) 80%, 
            transparent 100%)`,
        }}
      />

      {/* Enhanced effect when pressed */}
      {isPressed && (
        <>
          {/* Main gradient ooze from cursor */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: "translate(-50%, -50%)",
              width: "400px",
              height: "400px",
              background: `radial-gradient(circle at center, 
                rgba(99, 102, 241, ${0.3 + Math.sin(time * 2) * 0.1}) 0%,
                rgba(168, 85, 247, ${0.25 + Math.sin(time * 1.5) * 0.08}) 25%, 
                rgba(236, 72, 153, ${0.2 + Math.sin(time * 1.8) * 0.06}) 45%, 
                rgba(251, 146, 60, ${0.15 + Math.sin(time * 2.2) * 0.05}) 65%, 
                rgba(34, 197, 94, ${0.1 + Math.sin(time * 1.3) * 0.04}) 80%, 
                transparent 95%)`,
              borderRadius: "50%",
              filter: "blur(30px)",
            }}
          />

          {/* Secondary layer */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: "translate(-50%, -50%)",
              width: "250px",
              height: "250px",
              background: `radial-gradient(circle at center, 
                rgba(168, 85, 247, ${0.4 + Math.sin(time * 2.5) * 0.1}) 0%,
                rgba(236, 72, 153, ${0.3 + Math.sin(time * 1.7) * 0.08}) 35%, 
                rgba(251, 146, 60, ${0.2 + Math.sin(time * 2.1) * 0.06}) 60%, 
                transparent 85%)`,
              borderRadius: "50%",
              filter: "blur(20px)",
            }}
          />

          {/* Floating particles */}
          <div
            className="absolute pointer-events-none w-6 h-6 rounded-full bg-blue-400/30 blur-sm"
            style={{
              left: `${mousePosition.x + Math.sin(time * 3) * 4}%`,
              top: `${mousePosition.y + Math.cos(time * 3) * 4}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute pointer-events-none w-5 h-5 rounded-full bg-purple-400/25 blur-sm"
            style={{
              left: `${mousePosition.x + Math.sin(time * 2.5 + 1) * 5}%`,
              top: `${mousePosition.y + Math.cos(time * 2.5 + 1) * 5}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute pointer-events-none w-4 h-4 rounded-full bg-pink-400/20 blur-sm"
            style={{
              left: `${mousePosition.x + Math.sin(time * 3.5 + 2) * 6}%`,
              top: `${mousePosition.y + Math.cos(time * 3.5 + 2) * 6}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </>
      )}

      {/* Content area */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Interactive Gradient</h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            Move your cursor around to see the gradient follow. Press and drag for enhanced effects.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>X: {Math.round(mousePosition.x)}%</span>
            <span>•</span>
            <span>Y: {Math.round(mousePosition.y)}%</span>
            <span>•</span>
            <span className={isPressed ? "text-green-400" : "text-red-400"}>{isPressed ? "PAINTING" : "HOVER"}</span>
          </div>
        </div>
      </div>

      {/* Custom cursor */}
      <div
        className="absolute pointer-events-none z-50"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className={`w-2 h-2 rounded-full border-2 ${
            isPressed
              ? "bg-white/70 border-white/90 shadow-lg shadow-purple-500/30 scale-150"
              : "bg-white/40 border-white/60"
          }`}
          style={{
            transition: "transform 0.1s ease-out, background-color 0.1s ease-out, border-color 0.1s ease-out",
          }}
        />
      </div>
    </div>
  )
}

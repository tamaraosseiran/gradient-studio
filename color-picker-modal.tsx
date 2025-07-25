"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Pipette } from "lucide-react"

interface ColorPickerModalProps {
  isOpen: boolean
  color: number[] // RGB values 0-1
  onSave: (color: number[]) => void
  onCancel: () => void
  colorIndex: number
}

// Convert HSV to RGB
function hsvToRgb(h: number, s: number, v: number): number[] {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c

  let r = 0,
    g = 0,
    b = 0

  if (0 <= h && h < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= h && h < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= h && h < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= h && h < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= h && h < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= h && h < 360) {
    r = c
    g = 0
    b = x
  }

  return [r + m, g + m, b + m]
}

// Convert RGB to HSV
function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min

  let h = 0
  if (diff !== 0) {
    if (max === r) {
      h = ((g - b) / diff) % 6
    } else if (max === g) {
      h = (b - r) / diff + 2
    } else {
      h = (r - g) / diff + 4
    }
  }
  h = Math.round(h * 60)
  if (h < 0) h += 360

  const s = max === 0 ? 0 : diff / max
  const v = max

  return [h, s, v]
}

export default function ColorPickerModal({ isOpen, color, onSave, onCancel, colorIndex }: ColorPickerModalProps) {
  const [currentColor, setCurrentColor] = useState(color)
  const [hsv, setHsv] = useState<[number, number, number]>([0, 1, 1])
  const [isDraggingColor, setIsDraggingColor] = useState(false)
  const [isDraggingHue, setIsDraggingHue] = useState(false)

  const colorCanvasRef = useRef<HTMLCanvasElement>(null)
  const hueCanvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize HSV from RGB when modal opens or color changes
  useEffect(() => {
    if (isOpen) {
      setCurrentColor(color)
      const [h, s, v] = rgbToHsv(color[0], color[1], color[2])
      setHsv([h, s, v])
    }
  }, [isOpen, color])

  // Draw color area (saturation/lightness)
  const drawColorArea = useCallback(() => {
    const canvas = colorCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Create base hue color
    const hueColor = hsvToRgb(hsv[0], 1, 1)

    // Create horizontal gradient (saturation)
    const saturationGradient = ctx.createLinearGradient(0, 0, width, 0)
    saturationGradient.addColorStop(0, "white")
    saturationGradient.addColorStop(
      1,
      `rgb(${Math.round(hueColor[0] * 255)}, ${Math.round(hueColor[1] * 255)}, ${Math.round(hueColor[2] * 255)})`,
    )

    ctx.fillStyle = saturationGradient
    ctx.fillRect(0, 0, width, height)

    // Create vertical gradient (lightness)
    const lightnessGradient = ctx.createLinearGradient(0, 0, 0, height)
    lightnessGradient.addColorStop(0, "rgba(0, 0, 0, 0)")
    lightnessGradient.addColorStop(1, "rgba(0, 0, 0, 1)")

    ctx.fillStyle = lightnessGradient
    ctx.fillRect(0, 0, width, height)
  }, [hsv])

  // Draw hue slider
  const drawHueSlider = useCallback(() => {
    const canvas = hueCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Create hue gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    for (let i = 0; i <= 360; i += 60) {
      const color = hsvToRgb(i, 1, 1)
      gradient.addColorStop(
        i / 360,
        `rgb(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)})`,
      )
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }, [])

  // Redraw canvases when HSV changes
  useEffect(() => {
    drawColorArea()
    drawHueSlider()
  }, [drawColorArea, drawHueSlider])

  // Update RGB when HSV changes
  useEffect(() => {
    const rgb = hsvToRgb(hsv[0], hsv[1], hsv[2])
    setCurrentColor(rgb)
  }, [hsv])

  const handleColorAreaMouseDown = (e: React.MouseEvent) => {
    setIsDraggingColor(true)
    handleColorAreaMove(e)
  }

  const handleColorAreaMove = (e: React.MouseEvent) => {
    if (!isDraggingColor && e.type === "mousemove") return

    const canvas = colorCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.max(0, Math.min(canvas.width, (e.clientX - rect.left) * (canvas.width / rect.width)))
    const y = Math.max(0, Math.min(canvas.height, (e.clientY - rect.top) * (canvas.height / rect.height)))

    const s = x / canvas.width
    const v = 1 - y / canvas.height

    setHsv([hsv[0], s, v])
  }

  const handleHueMouseDown = (e: React.MouseEvent) => {
    setIsDraggingHue(true)
    handleHueMove(e)
  }

  const handleHueMove = (e: React.MouseEvent) => {
    if (!isDraggingHue && e.type === "mousemove") return

    const canvas = hueCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.max(0, Math.min(canvas.width, (e.clientX - rect.left) * (canvas.width / rect.width)))
    const h = (x / canvas.width) * 360

    setHsv([h, hsv[1], hsv[2]])
  }

  const handleMouseUp = () => {
    setIsDraggingColor(false)
    setIsDraggingHue(false)
  }

  const handleRgbChange = (component: "r" | "g" | "b", value: string) => {
    const numValue = Math.max(0, Math.min(255, Number.parseInt(value) || 0))
    const newColor = [...currentColor]

    if (component === "r") newColor[0] = numValue / 255
    if (component === "g") newColor[1] = numValue / 255
    if (component === "b") newColor[2] = numValue / 255

    setCurrentColor(newColor)
    const [h, s, v] = rgbToHsv(newColor[0], newColor[1], newColor[2])
    setHsv([h, s, v])
  }

  const handleSave = () => {
    onSave(currentColor)
  }

  // Add global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingColor) {
        const canvas = colorCanvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = Math.max(0, Math.min(canvas.width, (e.clientX - rect.left) * (canvas.width / rect.width)))
        const y = Math.max(0, Math.min(canvas.height, (e.clientY - rect.top) * (canvas.height / rect.height)))

        const s = x / canvas.width
        const v = 1 - y / canvas.height

        setHsv([hsv[0], s, v])
      }

      if (isDraggingHue) {
        const canvas = hueCanvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = Math.max(0, Math.min(canvas.width, (e.clientX - rect.left) * (canvas.width / rect.width)))
        const h = (x / canvas.width) * 360

        setHsv([h, hsv[1], hsv[2]])
      }
    }

    const handleGlobalMouseUp = () => {
      setIsDraggingColor(false)
      setIsDraggingHue(false)
    }

    if (isDraggingColor || isDraggingHue) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDraggingColor, isDraggingHue, hsv])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Color {colorIndex + 1}
            <Button variant="ghost" size="sm" onClick={onCancel} className="h-6 w-6 p-0 hover:bg-gray-700">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Color Area */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Color</Label>
            <div className="relative">
              <canvas
                ref={colorCanvasRef}
                width={300}
                height={200}
                className="w-full h-48 rounded-lg border border-gray-600 cursor-crosshair"
                onMouseDown={handleColorAreaMouseDown}
                onMouseMove={handleColorAreaMove}
                onMouseUp={handleMouseUp}
              />
              {/* Color indicator */}
              <div
                className="absolute w-4 h-4 border-2 border-white rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${hsv[1] * 100}%`,
                  top: `${(1 - hsv[2]) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Hue Slider */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Hue</Label>
            <div className="relative">
              <canvas
                ref={hueCanvasRef}
                width={300}
                height={20}
                className="w-full h-5 rounded border border-gray-600 cursor-pointer"
                onMouseDown={handleHueMouseDown}
                onMouseMove={handleHueMove}
                onMouseUp={handleMouseUp}
              />
              {/* Hue indicator */}
              <div
                className="absolute w-0.5 h-5 bg-white pointer-events-none transform -translate-x-1/2"
                style={{
                  left: `${(hsv[0] / 360) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* RGB Inputs */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium mb-1 block">R</Label>
              <Input
                type="number"
                min="0"
                max="255"
                value={Math.round(currentColor[0] * 255)}
                onChange={(e) => handleRgbChange("r", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">G</Label>
              <Input
                type="number"
                min="0"
                max="255"
                value={Math.round(currentColor[1] * 255)}
                onChange={(e) => handleRgbChange("g", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">B</Label>
              <Input
                type="number"
                min="0"
                max="255"
                value={Math.round(currentColor[2] * 255)}
                onChange={(e) => handleRgbChange("b", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Preview and Eyedropper */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border border-gray-600"
                style={{
                  backgroundColor: `rgb(${Math.round(currentColor[0] * 255)}, ${Math.round(currentColor[1] * 255)}, ${Math.round(currentColor[2] * 255)})`,
                }}
              />
              <div>
                <div className="text-sm font-medium">Preview</div>
                <div className="text-xs text-gray-400 font-mono">
                  rgb({Math.round(currentColor[0] * 255)}, {Math.round(currentColor[1] * 255)},{" "}
                  {Math.round(currentColor[2] * 255)})
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-gray-600 bg-transparent hover:bg-gray-700">
              <Pipette className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="border-gray-600 bg-transparent hover:bg-gray-700">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

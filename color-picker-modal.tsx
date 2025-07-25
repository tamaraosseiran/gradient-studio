"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EyeIcon as Eyedropper } from "lucide-react"

interface ColorPickerModalProps {
  isOpen: boolean
  color: number[]
  onSave: (color: number[]) => void
  onCancel: () => void
  colorIndex: number
}

// Convert RGB to HSV
function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min

  let h = 0
  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff) % 6
    else if (max === g) h = (b - r) / diff + 2
    else h = (r - g) / diff + 4
  }
  h = Math.round(h * 60)
  if (h < 0) h += 360

  const s = max === 0 ? 0 : diff / max
  const v = max

  return [h, s, v]
}

// Convert HSV to RGB
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c

  let r = 0,
    g = 0,
    b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  return [r + m, g + m, b + m]
}

export default function ColorPickerModal({ isOpen, color, onSave, onCancel, colorIndex }: ColorPickerModalProps) {
  const [currentColor, setCurrentColor] = useState(color)
  const [hsv, setHsv] = useState(() => rgbToHsv(color[0], color[1], color[2]))
  const colorAreaRef = useRef<HTMLCanvasElement>(null)
  const hueSliderRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setCurrentColor(color)
    setHsv(rgbToHsv(color[0], color[1], color[2]))
  }, [color])

  useEffect(() => {
    drawColorArea()
    drawHueSlider()
  }, [hsv])

  const drawColorArea = () => {
    const canvas = colorAreaRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Create gradient from white to the current hue
    const hueColor = hsvToRgb(hsv[0], 1, 1)

    // Horizontal gradient (saturation)
    const satGradient = ctx.createLinearGradient(0, 0, width, 0)
    satGradient.addColorStop(0, "white")
    satGradient.addColorStop(1, `rgb(${hueColor[0] * 255}, ${hueColor[1] * 255}, ${hueColor[2] * 255})`)

    ctx.fillStyle = satGradient
    ctx.fillRect(0, 0, width, height)

    // Vertical gradient (lightness)
    const lightGradient = ctx.createLinearGradient(0, 0, 0, height)
    lightGradient.addColorStop(0, "rgba(0, 0, 0, 0)")
    lightGradient.addColorStop(1, "rgba(0, 0, 0, 1)")

    ctx.fillStyle = lightGradient
    ctx.fillRect(0, 0, width, height)
  }

  const drawHueSlider = () => {
    const canvas = hueSliderRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    for (let i = 0; i <= 360; i += 60) {
      const rgb = hsvToRgb(i, 1, 1)
      gradient.addColorStop(i / 360, `rgb(${rgb[0] * 255}, ${rgb[1] * 255}, ${rgb[2] * 255})`)
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  const handleColorAreaClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = colorAreaRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const s = x / canvas.width
    const v = 1 - y / canvas.height

    const newHsv: [number, number, number] = [hsv[0], Math.max(0, Math.min(1, s)), Math.max(0, Math.min(1, v))]
    setHsv(newHsv)

    const rgb = hsvToRgb(newHsv[0], newHsv[1], newHsv[2])
    setCurrentColor(rgb)
  }

  const handleHueSliderClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = hueSliderRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left

    const h = (x / canvas.width) * 360

    const newHsv: [number, number, number] = [Math.max(0, Math.min(360, h)), hsv[1], hsv[2]]
    setHsv(newHsv)

    const rgb = hsvToRgb(newHsv[0], newHsv[1], newHsv[2])
    setCurrentColor(rgb)
  }

  const handleRgbChange = (component: number, value: string) => {
    const numValue = Math.max(0, Math.min(255, Number.parseInt(value) || 0))
    const newColor = [...currentColor]
    newColor[component] = numValue / 255
    setCurrentColor(newColor)
    setHsv(rgbToHsv(newColor[0], newColor[1], newColor[2]))
  }

  const handleSave = () => {
    onSave(currentColor)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Edit Color {colorIndex + 1}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Color Area */}
          <div className="relative">
            <canvas
              ref={colorAreaRef}
              width={280}
              height={200}
              className="w-full h-48 rounded-lg cursor-crosshair border border-gray-600"
              onClick={handleColorAreaClick}
            />
            {/* Color area indicator */}
            <div
              className="absolute w-4 h-4 border-2 border-white rounded-full pointer-events-none shadow-lg"
              style={{
                left: `${hsv[1] * 100}%`,
                top: `${(1 - hsv[2]) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>

          {/* Hue Slider */}
          <div className="relative">
            <canvas
              ref={hueSliderRef}
              width={280}
              height={20}
              className="w-full h-5 rounded cursor-pointer border border-gray-600"
              onClick={handleHueSliderClick}
            />
            {/* Hue slider indicator */}
            <div
              className="absolute w-4 h-6 border-2 border-white rounded-sm pointer-events-none shadow-lg bg-gray-800"
              style={{
                left: `${(hsv[0] / 360) * 100}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center gap-3">
            {/* Eyedropper Tool */}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-transparent hover:bg-white/10 hover:text-white transition-colors"
            >
              <Eyedropper className="w-4 h-4" />
            </Button>

            {/* Color Preview */}
            <div
              className="w-8 h-8 rounded-full border-2 border-gray-600"
              style={{
                backgroundColor: `rgb(${currentColor[0] * 255}, ${currentColor[1] * 255}, ${currentColor[2] * 255})`,
              }}
            />

            {/* RGB Inputs */}
            <div className="flex gap-2 flex-1">
              <div className="flex flex-col items-center">
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={Math.round(currentColor[0] * 255)}
                  onChange={(e) => handleRgbChange(0, e.target.value)}
                  className="w-16 h-8 text-xs text-center bg-gray-800 border-gray-600 text-white"
                />
                <label className="text-xs text-gray-400 mt-1">R</label>
              </div>
              <div className="flex flex-col items-center">
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={Math.round(currentColor[1] * 255)}
                  onChange={(e) => handleRgbChange(1, e.target.value)}
                  className="w-16 h-8 text-xs text-center bg-gray-800 border-gray-600 text-white"
                />
                <label className="text-xs text-gray-400 mt-1">G</label>
              </div>
              <div className="flex flex-col items-center">
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={Math.round(currentColor[2] * 255)}
                  onChange={(e) => handleRgbChange(2, e.target.value)}
                  className="w-16 h-8 text-xs text-center bg-gray-800 border-gray-600 text-white"
                />
                <label className="text-xs text-gray-400 mt-1">B</label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-gray-600 bg-transparent hover:bg-white/10 hover:text-white transition-colors"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

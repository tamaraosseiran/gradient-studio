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

// Convert RGB (0-1) to HSV
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
  h = (h * 60 + 360) % 360

  const s = max === 0 ? 0 : diff / max
  const v = max

  return [h, s, v]
}

// Convert HSV to RGB (0-1)
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c

  let r = 0,
    g = 0,
    b = 0

  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0]
  else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0]
  else if (h >= 120 && h < 180) [r, g, b] = [0, c, x]
  else if (h >= 180 && h < 240) [r, g, b] = [0, x, c]
  else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c]
  else if (h >= 300 && h < 360) [r, g, b] = [c, 0, x]

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
  }, [color, isOpen])

  useEffect(() => {
    drawColorArea()
    drawHueSlider()
  }, [hsv[0]]) // Redraw when hue changes

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

    // Vertical gradient (brightness)
    const brightGradient = ctx.createLinearGradient(0, 0, 0, height)
    brightGradient.addColorStop(0, "rgba(0, 0, 0, 0)")
    brightGradient.addColorStop(1, "rgba(0, 0, 0, 1)")

    ctx.fillStyle = brightGradient
    ctx.fillRect(0, 0, width, height)
  }

  const drawHueSlider = () => {
    const canvas = hueSliderRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Create rainbow gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    for (let i = 0; i <= 6; i++) {
      const hue = (i / 6) * 360
      const rgb = hsvToRgb(hue, 1, 1)
      gradient.addColorStop(i / 6, `rgb(${rgb[0] * 255}, ${rgb[1] * 255}, ${rgb[2] * 255})`)
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

    const saturation = x / canvas.width
    const value = 1 - y / canvas.height

    const newHsv: [number, number, number] = [hsv[0], saturation, value]
    setHsv(newHsv)

    const rgb = hsvToRgb(newHsv[0], newHsv[1], newHsv[2])
    setCurrentColor(rgb)
  }

  const handleHueSliderClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = hueSliderRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left

    const hue = (x / canvas.width) * 360
    const newHsv: [number, number, number] = [hue, hsv[1], hsv[2]]
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
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Color {colorIndex + 1}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Color Area */}
          <div className="relative">
            <canvas
              ref={colorAreaRef}
              width={300}
              height={200}
              className="w-full h-48 rounded-lg cursor-crosshair border border-gray-600"
              onClick={handleColorAreaClick}
            />
            {/* Color area selector */}
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
              width={300}
              height={20}
              className="w-full h-5 rounded cursor-pointer border border-gray-600"
              onClick={handleHueSliderClick}
            />
            {/* Hue selector */}
            <div
              className="absolute w-4 h-6 border-2 border-white rounded-sm pointer-events-none shadow-lg"
              style={{
                left: `${(hsv[0] / 360) * 100}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>

          {/* Color Preview and Tools */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              className="h-10 w-10 p-0 bg-transparent hover:bg-white/10 hover:text-white transition-colors"
            >
              <Eyedropper className="w-4 h-4" />
            </Button>
            <div
              className="w-12 h-10 rounded-lg border border-gray-600"
              style={{
                backgroundColor: `rgb(${currentColor[0] * 255}, ${currentColor[1] * 255}, ${currentColor[2] * 255})`,
              }}
            />
          </div>

          {/* RGB Inputs */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Input
                type="number"
                min="0"
                max="255"
                value={Math.round(currentColor[0] * 255)}
                onChange={(e) => handleRgbChange(0, e.target.value)}
                className="bg-gray-800 border-gray-600 text-white text-center"
              />
              <label className="block text-xs text-center text-gray-400">R</label>
            </div>
            <div className="space-y-1">
              <Input
                type="number"
                min="0"
                max="255"
                value={Math.round(currentColor[1] * 255)}
                onChange={(e) => handleRgbChange(1, e.target.value)}
                className="bg-gray-800 border-gray-600 text-white text-center"
              />
              <label className="block text-xs text-center text-gray-400">G</label>
            </div>
            <div className="space-y-1">
              <Input
                type="number"
                min="0"
                max="255"
                value={Math.round(currentColor[2] * 255)}
                onChange={(e) => handleRgbChange(2, e.target.value)}
                className="bg-gray-800 border-gray-600 text-white text-center"
              />
              <label className="block text-xs text-center text-gray-400">B</label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-gray-600 bg-transparent hover:bg-white/10 hover:text-white transition-colors"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

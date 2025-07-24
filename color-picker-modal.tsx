"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Check } from "lucide-react"

interface ColorPickerModalProps {
  isOpen: boolean
  color: number[]
  onSave: (color: number[]) => void
  onCancel: () => void
  colorIndex: number
}

// Convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h, s, l]
}

// Convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [r, g, b]
}

// Convert RGB array to hex
function rgbToHex(rgb: number[]): string {
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

// Convert hex to RGB array
function hexToRgb(hex: string): number[] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0, 0, 0]
  return [
    Number.parseInt(result[1], 16) / 255,
    Number.parseInt(result[2], 16) / 255,
    Number.parseInt(result[3], 16) / 255,
  ]
}

export default function ColorPickerModal({ isOpen, color, onSave, onCancel, colorIndex }: ColorPickerModalProps) {
  const [currentColor, setCurrentColor] = useState(color)
  const [hexValue, setHexValue] = useState(rgbToHex(color))
  const [hsl, setHsl] = useState(() => rgbToHsl(color[0], color[1], color[2]))

  useEffect(() => {
    if (isOpen) {
      setCurrentColor(color)
      setHexValue(rgbToHex(color))
      setHsl(rgbToHsl(color[0], color[1], color[2]))
    }
  }, [isOpen, color])

  const updateColorFromHSL = (newH: number, newS: number, newL: number) => {
    const [r, g, b] = hslToRgb(newH, newS, newL)
    const newColor = [r, g, b]
    setCurrentColor(newColor)
    setHexValue(rgbToHex(newColor))
    setHsl([newH, newS, newL])
  }

  const updateColorFromHex = (hex: string) => {
    setHexValue(hex)
    try {
      const newColor = hexToRgb(hex)
      setCurrentColor(newColor)
      const [h, s, l] = rgbToHsl(newColor[0], newColor[1], newColor[2])
      setHsl([h, s, l])
    } catch (e) {
      // Invalid hex, ignore
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-80 max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Edit Color {colorIndex + 1}</h3>
          <Button size="sm" variant="ghost" onClick={onCancel} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Color Preview */}
        <div className="mb-4">
          <div
            className="w-full h-16 rounded-lg border border-gray-600"
            style={{
              backgroundColor: `rgb(${currentColor[0] * 255}, ${currentColor[1] * 255}, ${currentColor[2] * 255})`,
            }}
          />
        </div>

        {/* HSL Sliders */}
        <div className="space-y-4 mb-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Hue: {Math.round(hsl[0] * 360)}°</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={hsl[0]}
              onChange={(e) => updateColorFromHSL(Number.parseFloat(e.target.value), hsl[1], hsl[2])}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(0, 100%, 50%), 
                  hsl(60, 100%, 50%), 
                  hsl(120, 100%, 50%), 
                  hsl(180, 100%, 50%), 
                  hsl(240, 100%, 50%), 
                  hsl(300, 100%, 50%), 
                  hsl(360, 100%, 50%))`,
              }}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Saturation: {Math.round(hsl[1] * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={hsl[1]}
              onChange={(e) => updateColorFromHSL(hsl[0], Number.parseFloat(e.target.value), hsl[2])}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(${hsl[0] * 360}, 0%, ${hsl[2] * 100}%), 
                  hsl(${hsl[0] * 360}, 100%, ${hsl[2] * 100}%))`,
              }}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Lightness: {Math.round(hsl[2] * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={hsl[2]}
              onChange={(e) => updateColorFromHSL(hsl[0], hsl[1], Number.parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(${hsl[0] * 360}, ${hsl[1] * 100}%, 0%), 
                  hsl(${hsl[0] * 360}, ${hsl[1] * 100}%, 50%), 
                  hsl(${hsl[0] * 360}, ${hsl[1] * 100}%, 100%))`,
              }}
            />
          </div>
        </div>

        {/* Hex Input */}
        <div className="mb-6">
          <label className="text-sm text-gray-300 mb-2 block">Hex Code</label>
          <Input
            value={hexValue}
            onChange={(e) => updateColorFromHex(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white font-mono"
            placeholder="#ffffff"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={() => onSave(currentColor)} className="bg-blue-600 hover:bg-blue-700 flex-1">
            <Check className="w-4 h-4 mr-2" />
            Apply
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-gray-600 hover:bg-gray-700 bg-transparent text-white hover:text-white flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

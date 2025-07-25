"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ColorPickerModalProps {
  isOpen: boolean
  color: number[]
  onSave: (color: number[]) => void
  onCancel: () => void
  colorIndex: number
}

export default function ColorPickerModal({ isOpen, color, onSave, onCancel, colorIndex }: ColorPickerModalProps) {
  const [tempColor, setTempColor] = useState(color)

  useEffect(() => {
    setTempColor(color)
  }, [color, isOpen])

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

  const hexToRgb = (hex: string): number[] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return [0, 0, 0]
    return [
      Number.parseInt(result[1], 16) / 255,
      Number.parseInt(result[2], 16) / 255,
      Number.parseInt(result[3], 16) / 255,
    ]
  }

  const handleHexChange = (hex: string) => {
    const rgb = hexToRgb(hex)
    setTempColor(rgb)
  }

  const handleSave = () => {
    onSave(tempColor)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Color {colorIndex + 1}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Color Preview */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div
              className="w-full h-20 rounded-lg border border-gray-600"
              style={{
                backgroundColor: `rgb(${Math.round(tempColor[0] * 255)}, ${Math.round(tempColor[1] * 255)}, ${Math.round(tempColor[2] * 255)})`,
              }}
            />
          </div>

          {/* Hex Input */}
          <div className="space-y-2">
            <Label htmlFor="hex-input">Hex Code</Label>
            <Input
              id="hex-input"
              type="text"
              value={rgbToHex(tempColor)}
              onChange={(e) => handleHexChange(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="#ffffff"
            />
          </div>

          {/* Color Picker Input */}
          <div className="space-y-2">
            <Label htmlFor="color-picker">Color Picker</Label>
            <input
              id="color-picker"
              type="color"
              value={rgbToHex(tempColor)}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-full h-10 rounded border border-gray-600 bg-gray-800 cursor-pointer"
            />
          </div>

          {/* RGB Sliders */}
          <div className="space-y-3">
            <div>
              <Label>Red: {Math.round(tempColor[0] * 255)}</Label>
              <input
                type="range"
                min="0"
                max="255"
                value={Math.round(tempColor[0] * 255)}
                onChange={(e) => setTempColor([Number.parseInt(e.target.value) / 255, tempColor[1], tempColor[2]])}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-red"
              />
            </div>
            <div>
              <Label>Green: {Math.round(tempColor[1] * 255)}</Label>
              <input
                type="range"
                min="0"
                max="255"
                value={Math.round(tempColor[1] * 255)}
                onChange={(e) => setTempColor([tempColor[0], Number.parseInt(e.target.value) / 255, tempColor[2]])}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-green"
              />
            </div>
            <div>
              <Label>Blue: {Math.round(tempColor[2] * 255)}</Label>
              <input
                type="range"
                min="0"
                max="255"
                value={Math.round(tempColor[2] * 255)}
                onChange={(e) => setTempColor([tempColor[0], tempColor[1], Number.parseInt(e.target.value) / 255])}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-blue"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-gray-600 text-white hover:bg-gray-700 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>

        <style jsx>{`
          .slider-red::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #ef4444;
            cursor: pointer;
          }
          .slider-green::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #22c55e;
            cursor: pointer;
          }
          .slider-blue::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}

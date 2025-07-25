"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon as EyeDropperIcon } from "lucide-react"

interface ColorPickerModalProps {
  isOpen: boolean
  color: number[]
  onSave: (color: number[]) => void
  onCancel: () => void
  colorIndex: number
}

export default function ColorPickerModal({ isOpen, color, onSave, onCancel, colorIndex }: ColorPickerModalProps) {
  const [currentColor, setCurrentColor] = useState<number[]>(color)
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(1)
  const [lightness, setLightness] = useState(0.5)

  const colorGradientRef = useRef<HTMLDivElement>(null)
  const hueSliderRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const isDraggingHueRef = useRef(false)

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 1
    g /= 1
    b /= 1
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

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
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
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

  // Initialize HSL values from RGB
  useEffect(() => {
    if (isOpen) {
      setCurrentColor(color)
      const [h, s, l] = rgbToHsl(color[0], color[1], color[2])
      setHue(h)
      setSaturation(s)
      setLightness(l)
    }
  }, [isOpen, color])

  // Handle mouse events for color gradient
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (colorGradientRef.current && colorGradientRef.current.contains(e.target as Node)) {
        isDraggingRef.current = true
        updateColorFromPosition(e)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        updateColorFromPosition(e)
      }
      if (isDraggingHueRef.current) {
        updateHueFromPosition(e)
      }
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      isDraggingHueRef.current = false
    }

    const updateColorFromPosition = (e: MouseEvent) => {
      if (colorGradientRef.current) {
        const rect = colorGradientRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))

        setSaturation(x)
        setLightness(1 - y)

        const [r, g, b] = hslToRgb(hue, x, 1 - y)
        setCurrentColor([r, g, b])
      }
    }

    const handleHueMouseDown = (e: MouseEvent) => {
      if (hueSliderRef.current && hueSliderRef.current.contains(e.target as Node)) {
        isDraggingHueRef.current = true
        updateHueFromPosition(e)
      }
    }

    const updateHueFromPosition = (e: MouseEvent) => {
      if (hueSliderRef.current) {
        const rect = hueSliderRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))

        setHue(x)

        const [r, g, b] = hslToRgb(x, saturation, lightness)
        setCurrentColor([r, g, b])
      }
    }

    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mousedown", handleHueMouseDown)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mousedown", handleHueMouseDown)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [hue, saturation, lightness])

  // Handle RGB input changes
  const handleRgbChange = (component: "r" | "g" | "b", value: string) => {
    const numValue = Math.max(0, Math.min(255, Number.parseInt(value) || 0))
    const normalizedValue = numValue / 255

    const newColor = [...currentColor]
    const index = component === "r" ? 0 : component === "g" ? 1 : 2
    newColor[index] = normalizedValue

    setCurrentColor(newColor)

    const [h, s, l] = rgbToHsl(newColor[0], newColor[1], newColor[2])
    setHue(h)
    setSaturation(s)
    setLightness(l)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Edit Color {colorIndex + 1}</DialogTitle>
        </DialogHeader>

        {/* Main color picker area */}
        <div className="space-y-4">
          {/* Color gradient */}
          <div
            ref={colorGradientRef}
            className="w-full h-48 rounded-md relative cursor-crosshair"
            style={{
              background: `linear-gradient(to top, #000, transparent), 
                          linear-gradient(to right, #fff, rgba(255,255,255,0)), 
                          hsl(${hue * 360}, 100%, 50%)`,
            }}
          >
            {/* Selection indicator */}
            <div
              className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${saturation * 100}%`,
                top: `${(1 - lightness) * 100}%`,
              }}
            />
          </div>

          {/* Hue slider */}
          <div
            ref={hueSliderRef}
            className="w-full h-8 rounded-md cursor-pointer relative"
            style={{
              background: `linear-gradient(to right, 
                #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`,
            }}
          >
            {/* Hue indicator */}
            <div
              className="absolute w-4 h-full top-0 transform -translate-x-1/2 pointer-events-none"
              style={{
                left: `${hue * 100}%`,
                background: "rgba(255,255,255,0.3)",
                border: "2px solid white",
                borderRadius: "4px",
              }}
            />
          </div>

          {/* Color preview and RGB inputs */}
          <div className="flex items-center gap-4">
            {/* Color preview */}
            <div className="flex items-center gap-2">
              <div
                className="w-12 h-12 rounded-full border border-gray-600"
                style={{
                  backgroundColor: `rgb(${Math.round(currentColor[0] * 255)}, ${Math.round(currentColor[1] * 255)}, ${Math.round(currentColor[2] * 255)})`,
                }}
              />
              <button className="p-2 rounded-full hover:bg-blue-600/20 hover:text-blue-400 transition-colors">
                <EyeDropperIcon className="w-4 h-4" />
              </button>
            </div>

            {/* RGB inputs */}
            <div className="grid grid-cols-3 gap-2 flex-1">
              <div>
                <Label htmlFor="r-value" className="text-xs mb-1 block">
                  R
                </Label>
                <Input
                  id="r-value"
                  type="number"
                  min="0"
                  max="255"
                  value={Math.round(currentColor[0] * 255)}
                  onChange={(e) => handleRgbChange("r", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white h-9 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="g-value" className="text-xs mb-1 block">
                  G
                </Label>
                <Input
                  id="g-value"
                  type="number"
                  min="0"
                  max="255"
                  value={Math.round(currentColor[1] * 255)}
                  onChange={(e) => handleRgbChange("g", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white h-9 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="b-value" className="text-xs mb-1 block">
                  B
                </Label>
                <Input
                  id="b-value"
                  type="number"
                  min="0"
                  max="255"
                  value={Math.round(currentColor[2] * 255)}
                  onChange={(e) => handleRgbChange("b", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white h-9 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-gray-700 bg-transparent hover:bg-blue-600/20 hover:text-blue-400 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(currentColor)}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

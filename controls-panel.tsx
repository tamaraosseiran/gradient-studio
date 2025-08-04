"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { RotateCcw, Edit3, Shuffle, ChevronLeft, Dice6 } from "lucide-react"
import ColorPickerModal from "./color-picker-modal"

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

interface ControlsPanelProps {
  speed: number
  setSpeed: (value: number) => void
  intensity: number
  setIntensity: (value: number) => void
  pressIntensity: number
  setPressIntensity: (value: number) => void
  flowDirection: number
  setFlowDirection: (value: number) => void
  waveFrequency: number
  setWaveFrequency: (value: number) => void
  colorShift: number
  setColorShift: (value: number) => void
  hoverRadius: number
  setHoverRadius: (value: number) => void
  onReset: () => void
  currentPalette: string
  colorPalette: number[][]
  onPaletteChange: (palette: string) => void
  onCustomPaletteChange: (palette: number[][]) => void
  onShufflePalette: () => void
  onRandomPalette: () => void
  palettes: Record<string, number[][]>
}

export default function ControlsPanel({
  speed,
  setSpeed,
  intensity,
  setIntensity,
  pressIntensity,
  setPressIntensity,
  flowDirection,
  setFlowDirection,
  waveFrequency,
  setWaveFrequency,
  colorShift,
  setColorShift,
  hoverRadius,
  setHoverRadius,
  onReset,
  currentPalette,
  colorPalette,
  onPaletteChange,
  onCustomPaletteChange,
  onShufflePalette,
  onRandomPalette,
  palettes,
}: ControlsPanelProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isHidden, setIsHidden] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleColorEdit = (index: number) => {
    setEditingIndex(index)
  }

  const handleColorSave = (newColor: number[]) => {
    if (editingIndex !== null) {
      const newPalette = [...colorPalette]
      newPalette[editingIndex] = newColor
      onCustomPaletteChange(newPalette)
      setEditingIndex(null)
    }
  }

  const handleColorCancel = () => {
    setEditingIndex(null)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newPalette = [...colorPalette]
    const draggedColor = newPalette[draggedIndex]

    // Remove the dragged color
    newPalette.splice(draggedIndex, 1)

    // Insert at the new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex
    newPalette.splice(insertIndex, 0, draggedColor)

    onCustomPaletteChange(newPalette)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <>
      <div className="absolute top-4 left-4 z-10">
        {/* Single morphing container */}
        <div
          className={`transition-all duration-500 ease-in-out bg-black/80 border border-gray-700 text-white rounded-lg overflow-hidden ${
            isHidden
              ? "w-10 h-10" // Collapsed: just the button size
              : "w-72 h-auto" // Expanded: full panel size
          }`}
        >
          {/* Toggle Button - conditionally positioned */}
          <div
            className={`absolute z-20 transition-all duration-300 ${
              isHidden
                ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" // Centered when collapsed
                : "top-3 right-3" // Top-right when expanded
            }`}
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsHidden(!isHidden)}
              className="h-6 w-6 p-1 bg-transparent hover:bg-white/10 hover:text-white transition-colors rounded-md"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isHidden ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {/* Panel Content - fades in/out */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              isHidden ? "opacity-0 pointer-events-none scale-95" : "opacity-100 pointer-events-auto scale-100"
            }`}
          >
            <Card className="bg-transparent border-none text-white shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between pr-10">
                  <div className="flex items-center gap-3">
                    <span>Controls</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onReset}
                      className="h-6 w-6 p-1 bg-transparent hover:bg-white/10 hover:text-white transition-colors rounded-md"
                      title="Reset to defaults"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Controls */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium">Speed</label>
                    <span className="text-xs font-normal text-gray-300">{speed.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[speed]}
                    onValueChange={(value) => setSpeed(value[0])}
                    min={0}
                    max={10}
                    step={0.5}
                    className="w-full [&_[role=slider]]:bg-white [&_[data-orientation=horizontal]]:bg-gray-600 [&_[data-orientation=horizontal]_span]:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium">Brightness</label>
                    <span className="text-xs font-normal text-gray-300">{intensity.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[intensity]}
                    onValueChange={(value) => setIntensity(value[0])}
                    min={0}
                    max={10}
                    step={0.5}
                    className="w-full [&_[role=slider]]:bg-white [&_[data-orientation=horizontal]]:bg-gray-600 [&_[data-orientation=horizontal]_span]:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium">Press Intensity</label>
                    <span className="text-xs font-normal text-gray-300">
                      {(1 + (pressIntensity / 10) * 1.5).toFixed(1)}x
                    </span>
                  </div>
                  <Slider
                    value={[pressIntensity]}
                    onValueChange={(value) => setPressIntensity(value[0])}
                    min={0}
                    max={10}
                    step={0.5}
                    className="w-full [&_[role=slider]]:bg-white [&_[data-orientation=horizontal]]:bg-gray-600 [&_[data-orientation=horizontal]_span]:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium">Radius</label>
                    <span className="text-xs font-normal text-gray-300">{hoverRadius.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[hoverRadius]}
                    onValueChange={(value) => setHoverRadius(value[0])}
                    min={0.1}
                    max={2.0}
                    step={0.1}
                    className="w-full [&_[role=slider]]:bg-white [&_[data-orientation=horizontal]]:bg-gray-600 [&_[data-orientation=horizontal]_span]:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium">Wave Density</label>
                    <span className="text-xs font-normal text-gray-300">{waveFrequency.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[waveFrequency]}
                    onValueChange={(value) => setWaveFrequency(value[0])}
                    min={0}
                    max={10}
                    step={0.5}
                    className="w-full [&_[role=slider]]:bg-white [&_[data-orientation=horizontal]]:bg-gray-600 [&_[data-orientation=horizontal]_span]:bg-white"
                  />
                </div>

                {/* Color Palette Section */}
                <div className="border-t border-gray-600 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium">Colors</label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={onShufflePalette}
                        className="h-6 w-6 p-1 bg-transparent hover:bg-white/10 hover:text-white transition-colors rounded-md"
                        title="Shuffle color order"
                      >
                        <Shuffle className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Current Palette Colors */}
                    <div className="grid grid-cols-5 gap-3">
                      {colorPalette.map((color, index) => (
                        <div key={index} className="space-y-2">
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`w-full h-12 rounded-lg border cursor-move transition-all relative group ${
                              dragOverIndex === index && draggedIndex !== index
                                ? "border-white border-2 scale-105"
                                : draggedIndex === index
                                  ? "border-blue-400 border-2 opacity-50 scale-95"
                                  : "border-gray-600 hover:border-white"
                            }`}
                            style={{ backgroundColor: `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255})` }}
                            onClick={() => handleColorEdit(index)}
                          >
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                              <Edit3 className="w-4 h-4 text-white" />
                            </div>
                          </div>

                          {/* Show hex code below each color */}
                          <div className="text-[10px] text-gray-400 text-center font-mono">{rgbToHex(color)}</div>
                        </div>
                      ))}
                    </div>

                    {/* I'm Feeling Lucky Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onRandomPalette}
                      className="border-gray-600 bg-transparent hover:bg-white/10 hover:text-white transition-colors w-full"
                    >
                      <Dice6 className="w-4 h-4 mr-2" />
                      I'm Feeling Lucky
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Color Picker Modal */}
      <ColorPickerModal
        isOpen={editingIndex !== null}
        color={editingIndex !== null ? colorPalette[editingIndex] : [0, 0, 0]}
        onSave={handleColorSave}
        onCancel={handleColorCancel}
        colorIndex={editingIndex || 0}
      />
    </>
  )
}

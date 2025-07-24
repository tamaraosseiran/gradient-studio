"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { RotateCcw, Edit3, Shuffle, Palette, ChevronLeft, GripVertical } from "lucide-react"
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

  if (isHidden) {
    return (
      <div className="absolute top-4 left-4 z-10">
        <Button
          size="sm"
          onClick={() => setIsHidden(false)}
          className="bg-black/80 border-gray-700 text-white hover:bg-gray-700"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="absolute top-4 left-4 w-80 z-10">
        <Card className="bg-black/80 border-gray-700 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Gradient Controls
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onReset}
                  className="border-gray-600 hover:bg-gray-700 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsHidden(true)}
                  className="border-gray-600 hover:bg-gray-700 bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Main Controls */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Speed</label>
                <span className="text-sm font-normal text-gray-300">{speed.toFixed(1)}</span>
              </div>
              <Slider
                value={[speed]}
                onValueChange={(value) => setSpeed(value[0])}
                min={0}
                max={10}
                step={0.5}
                className="w-full [&_[role=slider]]:bg-white [&_[data-orientation=horizontal]]:bg-gray-600 [&_[data-orientation=horizontal]_span]:bg-white"
              />
              <p className="text-xs text-gray-400 mt-1">Animation speed and flow rate</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Base Intensity</label>
                <span className="text-sm font-normal text-gray-300">{intensity.toFixed(1)}</span>
              </div>
              <Slider
                value={[intensity]}
                onValueChange={(value) => setIntensity(value[0])}
                min={0}
                max={10}
                step={0.5}
                className="w-full [&_[role=slider]]:bg-white [&_[data-orientation=horizontal]]:bg-gray-600 [&_[data-orientation=horizontal]_span]:bg-white"
              />
              <p className="text-xs text-gray-400 mt-1">Overall gradient brightness</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Press Intensity</label>
                <span className="text-sm font-normal text-gray-300">
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
              <p className="text-xs text-gray-400 mt-1">Interaction effect multiplier</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Flow Direction</label>
                <span className="text-sm font-normal text-gray-300">{(flowDirection * 57.3).toFixed(0)}°</span>
              </div>
              <Slider
                value={[flowDirection]}
                onValueChange={(value) => setFlowDirection(value[0])}
                min={0}
                max={6.28}
                step={0.1}
                className="w-full [&_[role=slider]]:bg-white [&_[data-orientation=horizontal]]:bg-gray-600 [&_[data-orientation=horizontal]_span]:bg-white"
              />
              <p className="text-xs text-gray-400 mt-1">Gradient movement direction</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Wave Frequency</label>
                <span className="text-sm font-normal text-gray-300">{waveFrequency.toFixed(1)}</span>
              </div>
              <Slider
                value={[waveFrequency]}
                onValueChange={(value) => setWaveFrequency(value[0])}
                min={0}
                max={10}
                step={0.5}
                className="w-full [&_[role=slider]]:bg-white [&_[data-orientation=horizontal]]:bg-gray-600 [&_[data-orientation=horizontal]_span]:bg-white"
              />
              <p className="text-xs text-gray-400 mt-1">Wave pattern density</p>
            </div>

            {/* Color Palette Section */}
            <div className="border-t border-gray-600 pt-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Colors</label>

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
                          <div className="flex items-center gap-1">
                            <GripVertical className="w-4 h-4 text-white" />
                            <Edit3 className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Show hex code below each color */}
                      <div className="text-xs text-gray-400 text-center font-mono">{rgbToHex(color)}</div>
                    </div>
                  ))}
                </div>

                {/* Template Selection */}
                <div className="space-y-2">
                  <select
                    value={currentPalette}
                    onChange={(e) => onPaletteChange(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white text-sm"
                  >
                    {Object.keys(palettes).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onShufflePalette}
                    className="border-gray-600 hover:bg-gray-700 bg-transparent flex-1"
                  >
                    <Shuffle className="w-4 h-4 mr-1" />
                    Shuffle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onRandomPalette}
                    className="border-gray-600 hover:bg-gray-700 bg-transparent flex-1"
                  >
                    <Palette className="w-4 h-4 mr-1" />
                    Custom
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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

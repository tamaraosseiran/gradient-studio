"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import ExportPanel from "./export-panel"

interface ExportButtonProps {
  colorPalette: number[][]
  speed: number
  intensity: number
  pressIntensity: number
  flowDirection: number
  waveFrequency: number
  colorShift: number
  currentPalette: string
}

export default function ExportButton({
  colorPalette,
  speed,
  intensity,
  pressIntensity,
  flowDirection,
  waveFrequency,
  colorShift,
  currentPalette,
}: ExportButtonProps) {
  const [showExport, setShowExport] = useState(false)

  return (
    <>
      {/* Floating Export Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          size="sm"
          onClick={() => setShowExport(!showExport)}
          className="bg-black/80 border-gray-700 text-white hover:bg-gray-700 border"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Export Panel - Positioned on the right */}
      {showExport && (
        <div className="absolute top-16 right-4 w-80 z-10">
          <ExportPanel
            colorPalette={colorPalette}
            speed={speed}
            intensity={intensity}
            pressIntensity={pressIntensity}
            flowDirection={flowDirection}
            waveFrequency={waveFrequency}
            colorShift={colorShift}
            currentPalette={currentPalette}
          />
        </div>
      )}
    </>
  )
}

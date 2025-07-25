"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import ExportPanel from "./export-panel"

interface ExportButtonProps {
  speed: number
  intensity: number
  pressIntensity: number
  flowDirection: number
  waveFrequency: number
  colorShift: number
  hoverRadius: number
  colorPalette: number[][]
}

export default function ExportButton({
  speed,
  intensity,
  pressIntensity,
  flowDirection,
  waveFrequency,
  colorShift,
  hoverRadius,
  colorPalette,
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-4 right-4 z-10">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-black/80 border-gray-700 text-white hover:bg-gray-700 backdrop-blur-sm"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <ExportPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        speed={speed}
        intensity={intensity}
        pressIntensity={pressIntensity}
        flowDirection={flowDirection}
        waveFrequency={waveFrequency}
        colorShift={colorShift}
        hoverRadius={hoverRadius}
        colorPalette={colorPalette}
      />
    </>
  )
}

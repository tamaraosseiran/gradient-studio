"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check } from "lucide-react"

interface ExportPanelProps {
  isOpen: boolean
  onClose: () => void
  speed: number
  intensity: number
  pressIntensity: number
  flowDirection: number
  waveFrequency: number
  colorShift: number
  hoverRadius: number
  colorPalette: number[][]
}

export default function ExportPanel({
  isOpen,
  onClose,
  speed,
  intensity,
  pressIntensity,
  flowDirection,
  waveFrequency,
  colorShift,
  hoverRadius,
  colorPalette,
}: ExportPanelProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  const copyToClipboard = async (text: string, tab: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedTab(tab)
      setTimeout(() => setCopiedTab(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // Convert RGB array to hex
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

  // Generate CSS
  const generateCSS = () => {
    const colors = colorPalette.map(rgbToHex).join(", ")
    return `/* Dynamic Gradient CSS */
.dynamic-gradient {
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${colors});
  background-size: 200% 200%;
  animation: gradientShift ${(10 - speed) * 2}s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Update CSS custom properties with JavaScript */
/* document.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--mouse-x', (e.clientX / window.innerWidth * 100) + '%');
  document.documentElement.style.setProperty('--mouse-y', (e.clientY / window.innerHeight * 100) + '%');
}); */`
  }

  // Generate SVG
  const generateSVG = () => {
    const colors = colorPalette
      .map((color, index) => {
        const hex = rgbToHex(color)
        const offset = (index / (colorPalette.length - 1)) * 100
        return `<stop offset="${offset}%" stopColor="${hex}" />`
      })
      .join("\n    ")

    return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="dynamicGradient" cx="50%" cy="50%" r="70%">
      ${colors}
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#dynamicGradient)" />
</svg>`
  }

  // Generate React Component
  const generateReact = () => {
    const colorsArray = colorPalette.map(rgbToHex)
    return `import React, { useState, useEffect } from 'react';

const DynamicGradient = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const colors = ${JSON.stringify(colorsArray)};
  const intensity = ${intensity};
  const pressMultiplier = ${pressIntensity};

  return (
    <div
      className="w-full h-screen relative overflow-hidden bg-black"
      style={{
        background: \`radial-gradient(circle at \${mousePos.x}% \${mousePos.y}%, 
          \${colors.map((color, i) => 
            \`\${color}\${Math.round((intensity + (isPressed ? pressMultiplier : 0)) * (5 - i))}%\`
          ).join(', ')}, 
          transparent 100%)\`,
        cursor: 'none'
      }}
    >
      {/* Your content here */}
    </div>
  );
};

export default DynamicGradient;`
  }

  // Generate Configuration
  const generateConfig = () => {
    return JSON.stringify(
      {
        speed,
        intensity,
        pressIntensity,
        flowDirection,
        waveFrequency,
        colorShift,
        hoverRadius,
        colorPalette: colorPalette.map(rgbToHex),
        settings: {
          speed: { min: 0, max: 10, step: 0.5 },
          intensity: { min: 0, max: 10, step: 0.5 },
          pressIntensity: { min: 0, max: 10, step: 0.5 },
          flowDirection: { min: 0, max: 6.28, step: 0.1 },
          waveFrequency: { min: 0, max: 10, step: 0.5 },
          colorShift: { min: 0, max: 6.28, step: 0.1 },
          hoverRadius: { min: 0.1, max: 2.0, step: 0.1 },
        },
      },
      null,
      2,
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[80vh] overflow-hidden bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Export Gradient</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="css" className="w-full min-w-0">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-600">
            <TabsTrigger
              value="css"
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300 hover:text-white"
            >
              CSS
            </TabsTrigger>
            <TabsTrigger
              value="svg"
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300 hover:text-white"
            >
              SVG
            </TabsTrigger>
            <TabsTrigger
              value="react"
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300 hover:text-white"
            >
              React
            </TabsTrigger>
            <TabsTrigger
              value="config"
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300 hover:text-white"
            >
              Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="css" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">CSS Implementation</h3>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(generateCSS(), "css")}
                  className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-500"
                >
                  {copiedTab === "css" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 border border-gray-600 max-w-full whitespace-pre-wrap break-words">
                <code className="block max-w-full">{generateCSS()}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="svg" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">SVG Export</h3>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(generateSVG(), "svg")}
                  className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-500"
                >
                  {copiedTab === "svg" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 border border-gray-600 max-w-full whitespace-pre-wrap break-words">
                <code className="block max-w-full">{generateSVG()}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="react" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">React Component</h3>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(generateReact(), "react")}
                  className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-500"
                >
                  {copiedTab === "react" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 border border-gray-600 max-w-full whitespace-pre-wrap break-words">
                <code className="block max-w-full">{generateReact()}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="config" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Configuration JSON</h3>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(generateConfig(), "config")}
                  className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-500"
                >
                  {copiedTab === "config" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 border border-gray-600 max-w-full whitespace-pre-wrap break-words">
                <code className="block max-w-full">{generateConfig()}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Download, Copy, Code, ImageIcon, Palette, Settings } from "lucide-react"

interface ExportPanelProps {
  colorPalette: number[][]
  speed: number
  intensity: number
  pressIntensity: number
  flowDirection: number
  waveFrequency: number
  colorShift: number
  currentPalette: string
}

export default function ExportPanel({
  colorPalette,
  speed,
  intensity,
  pressIntensity,
  flowDirection,
  waveFrequency,
  colorShift,
  currentPalette,
}: ExportPanelProps) {
  const [exportType, setExportType] = useState<"css" | "svg" | "config" | "react">("css")
  const [copied, setCopied] = useState(false)

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

  // Generate CSS gradient
  const generateCSS = () => {
    const colors = colorPalette.map(rgbToHex)
    const angle = Math.round(flowDirection * 57.3) // Convert to degrees

    return `/* Dynamic Gradient - ${currentPalette} */
.dynamic-gradient {
  background: linear-gradient(${angle}deg, 
    ${colors[0]} 0%, 
    ${colors[1]} 25%, 
    ${colors[2]} 50%, 
    ${colors[3]} 75%, 
    ${colors[4]} 100%
  );
  background-size: 400% 400%;
  animation: gradientShift ${Math.max(1, 11 - speed)}s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Interactive version with hover effect */
.dynamic-gradient:hover {
  background-size: 200% 200%;
  animation-duration: ${Math.max(0.5, (11 - speed) / 2)}s;
}`
  }

  // Generate SVG
  const generateSVG = () => {
    const colors = colorPalette.map(rgbToHex)
    const angle = flowDirection * 57.3 // Convert to degrees

    return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dynamicGradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle.toFixed(0)})">
      <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1">
        <animate attributeName="stop-color" 
          values="${colors[0]};${colors[1]};${colors[2]};${colors[3]};${colors[4]};${colors[0]}" 
          dur="${Math.max(1, 11 - speed)}s" 
          repeatCount="indefinite"/>
      </stop>
      <stop offset="25%" style="stop-color:${colors[1]};stop-opacity:1">
        <animate attributeName="stop-color" 
          values="${colors[1]};${colors[2]};${colors[3]};${colors[4]};${colors[0]};${colors[1]}" 
          dur="${Math.max(1, 11 - speed)}s" 
          repeatCount="indefinite"/>
      </stop>
      <stop offset="50%" style="stop-color:${colors[2]};stop-opacity:1">
        <animate attributeName="stop-color" 
          values="${colors[2]};${colors[3]};${colors[4]};${colors[0]};${colors[1]};${colors[2]}" 
          dur="${Math.max(1, 11 - speed)}s" 
          repeatCount="indefinite"/>
      </stop>
      <stop offset="75%" style="stop-color:${colors[3]};stop-opacity:1">
        <animate attributeName="stop-color" 
          values="${colors[3]};${colors[4]};${colors[0]};${colors[1]};${colors[2]};${colors[3]}" 
          dur="${Math.max(1, 11 - speed)}s" 
          repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" style="stop-color:${colors[4]};stop-opacity:1">
        <animate attributeName="stop-color" 
          values="${colors[4]};${colors[0]};${colors[1]};${colors[2]};${colors[3]};${colors[4]}" 
          dur="${Math.max(1, 11 - speed)}s" 
          repeatCount="indefinite"/>
      </stop>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#dynamicGradient)"/>
</svg>`
  }

  // Generate React component
  const generateReact = () => {
    const colors = colorPalette.map(rgbToHex)
    const angle = Math.round(flowDirection * 57.3)

    return `import React from 'react';

const DynamicGradient = ({ className = "", children, ...props }) => {
  const gradientStyle = {
    background: \`linear-gradient(\${${angle}}deg, 
      ${colors[0]} 0%, 
      ${colors[1]} 25%, 
      ${colors[2]} 50%, 
      ${colors[3]} 75%, 
      ${colors[4]} 100%
    )\`,
    backgroundSize: '400% 400%',
    animation: 'gradientShift ${Math.max(1, 11 - speed)}s ease infinite',
  };

  return (
    <div 
      className={\`dynamic-gradient \${className}\`}
      style={gradientStyle}
      {...props}
    >
      {children}
      <style jsx>{\`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .dynamic-gradient:hover {
          background-size: 200% 200%;
          animation-duration: ${Math.max(0.5, (11 - speed) / 2)}s;
        }
      \`}</style>
    </div>
  );
};

export default DynamicGradient;`
  }

  // Generate configuration JSON
  const generateConfig = () => {
    return JSON.stringify(
      {
        name: currentPalette,
        settings: {
          speed,
          intensity,
          pressIntensity,
          flowDirection,
          waveFrequency,
          colorShift,
        },
        palette: {
          colors: colorPalette.map(rgbToHex),
          rgb: colorPalette,
        },
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    )
  }

  const getExportContent = () => {
    switch (exportType) {
      case "css":
        return generateCSS()
      case "svg":
        return generateSVG()
      case "react":
        return generateReact()
      case "config":
        return generateConfig()
      default:
        return ""
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getExportContent())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadFile = () => {
    const content = getExportContent()
    const extensions = { css: "css", svg: "svg", react: "jsx", config: "json" }
    const mimeTypes = {
      css: "text/css",
      svg: "image/svg+xml",
      react: "text/javascript",
      config: "application/json",
    }

    const blob = new Blob([content], { type: mimeTypes[exportType] })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `gradient-${currentPalette.toLowerCase().replace(/\s+/g, "-")}.${extensions[exportType]}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="bg-black/80 border-gray-700 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Export Gradient</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export Type Selection */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant={exportType === "css" ? "default" : "outline"}
            onClick={() => setExportType("css")}
            className={exportType === "css" ? "" : "border-gray-600 hover:bg-gray-700 bg-transparent"}
          >
            <Code className="w-4 h-4 mr-2" />
            CSS
          </Button>
          <Button
            size="sm"
            variant={exportType === "svg" ? "default" : "outline"}
            onClick={() => setExportType("svg")}
            className={exportType === "svg" ? "" : "border-gray-600 hover:bg-gray-700 bg-transparent"}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            SVG
          </Button>
          <Button
            size="sm"
            variant={exportType === "react" ? "default" : "outline"}
            onClick={() => setExportType("react")}
            className={exportType === "react" ? "" : "border-gray-600 hover:bg-gray-700 bg-transparent"}
          >
            <Palette className="w-4 h-4 mr-2" />
            React
          </Button>
          <Button
            size="sm"
            variant={exportType === "config" ? "default" : "outline"}
            onClick={() => setExportType("config")}
            className={exportType === "config" ? "" : "border-gray-600 hover:bg-gray-700 bg-transparent"}
          >
            <Settings className="w-4 h-4 mr-2" />
            Config
          </Button>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {exportType === "css" && "CSS Code"}
            {exportType === "svg" && "SVG Code"}
            {exportType === "react" && "React Component"}
            {exportType === "config" && "Configuration JSON"}
          </label>
          <Textarea
            value={getExportContent()}
            readOnly
            className="h-48 text-xs font-mono bg-gray-900 border-gray-600 text-gray-300"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="sm" onClick={copyToClipboard} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Copy className="w-4 h-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            size="sm"
            onClick={downloadFile}
            variant="outline"
            className="flex-1 border-gray-600 hover:bg-gray-700 bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

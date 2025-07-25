"use client"

import { Suspense } from "react"
import WebGLGradientPage from "../webgl-gradient-page"
import FallbackGradient from "../fallback-gradient"

export default function Page() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Suspense fallback={<FallbackGradient />}>
        <WebGLGradientPage />
      </Suspense>
    </div>
  )
}

import dynamic from "next/dynamic"

// Import the WebGL gradient page with no SSR to avoid hydration issues
const WebGLGradientPage = dynamic(() => import("../webgl-gradient-page"), {
  ssr: false,
})

export default function Page() {
  return <WebGLGradientPage />
}

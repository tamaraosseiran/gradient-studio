export const COLOR_PALETTES = {
  "Sunset Dreams": [
    [1.0, 0.4, 0.2], // Orange-red
    [1.0, 0.6, 0.0], // Orange
    [0.9, 0.3, 0.6], // Pink
    [0.7, 0.2, 0.8], // Purple
    [0.3, 0.1, 0.9], // Blue
  ],
  "Ocean Depths": [
    [0.0, 0.3, 0.8], // Deep blue
    [0.0, 0.5, 0.9], // Ocean blue
    [0.2, 0.7, 1.0], // Light blue
    [0.4, 0.9, 0.9], // Cyan
    [0.6, 1.0, 0.8], // Aqua
  ],
  "Forest Mystique": [
    [0.1, 0.4, 0.2], // Dark green
    [0.2, 0.6, 0.3], // Forest green
    [0.4, 0.8, 0.4], // Light green
    [0.6, 0.9, 0.6], // Mint
    [0.8, 1.0, 0.8], // Pale green
  ],
  "Cosmic Purple": [
    [0.2, 0.0, 0.4], // Deep purple
    [0.4, 0.1, 0.6], // Purple
    [0.6, 0.3, 0.8], // Light purple
    [0.8, 0.5, 0.9], // Lavender
    [1.0, 0.7, 1.0], // Pink-purple
  ],
  "Golden Hour": [
    [0.8, 0.3, 0.0], // Dark orange
    [1.0, 0.5, 0.1], // Orange
    [1.0, 0.7, 0.2], // Golden
    [1.0, 0.9, 0.4], // Light gold
    [1.0, 1.0, 0.8], // Cream
  ],
  "Neon Nights": [
    [1.0, 0.0, 0.5], // Hot pink
    [0.8, 0.0, 1.0], // Magenta
    [0.4, 0.0, 1.0], // Blue-purple
    [0.0, 0.5, 1.0], // Electric blue
    [0.0, 1.0, 0.8], // Cyan
  ],
  "Autumn Leaves": [
    [0.6, 0.2, 0.0], // Brown
    [0.8, 0.4, 0.1], // Rust
    [1.0, 0.6, 0.0], // Orange
    [1.0, 0.8, 0.2], // Yellow-orange
    [1.0, 1.0, 0.4], // Yellow
  ],
  "Arctic Aurora": [
    [0.0, 0.2, 0.4], // Dark blue
    [0.0, 0.4, 0.6], // Blue
    [0.2, 0.6, 0.8], // Light blue
    [0.4, 0.8, 0.9], // Ice blue
    [0.8, 1.0, 1.0], // White-blue
  ],
}

export function getRandomPalette(): number[][] {
  const paletteNames = Object.keys(COLOR_PALETTES)
  const randomName = paletteNames[Math.floor(Math.random() * paletteNames.length)]
  return COLOR_PALETTES[randomName as keyof typeof COLOR_PALETTES]
}

export function generateHarmoniousPalette(): number[][] {
  const baseHue = Math.random() * 360
  const palette: number[][] = []

  for (let i = 0; i < 5; i++) {
    const hue = (baseHue + i * 30) % 360
    const saturation = 0.7 + Math.random() * 0.3
    const lightness = 0.4 + Math.random() * 0.4

    // Convert HSL to RGB
    const rgb = hslToRgb(hue / 360, saturation, lightness)
    palette.push(rgb)
  }

  return palette
}

function hslToRgb(h: number, s: number, l: number): number[] {
  let r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
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

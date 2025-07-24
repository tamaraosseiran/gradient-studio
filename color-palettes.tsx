"use client"

// Curated color palettes with good gradient combinations
export const COLOR_PALETTES = {
  "Sunset Dreams": [
    [1.0, 0.4, 0.2], // Warm orange
    [1.0, 0.6, 0.3], // Light orange
    [1.0, 0.8, 0.4], // Yellow
    [0.9, 0.5, 0.7], // Pink
    [0.7, 0.3, 0.8], // Purple
  ],
  "Ocean Breeze": [
    [0.2, 0.6, 1.0], // Light blue
    [0.3, 0.8, 0.9], // Cyan
    [0.4, 0.9, 0.8], // Turquoise
    [0.5, 0.8, 0.6], // Mint
    [0.3, 0.7, 0.9], // Sky blue
  ],
  "Forest Whisper": [
    [0.3, 0.7, 0.4], // Forest green
    [0.5, 0.8, 0.3], // Lime
    [0.7, 0.9, 0.4], // Yellow green
    [0.4, 0.6, 0.3], // Olive
    [0.2, 0.5, 0.3], // Dark green
  ],
  "Lavender Fields": [
    [0.7, 0.5, 0.9], // Lavender
    [0.8, 0.6, 0.9], // Light purple
    [0.9, 0.7, 0.8], // Pink
    [0.6, 0.4, 0.8], // Deep purple
    [0.8, 0.8, 0.9], // Very light purple
  ],
  "Autumn Leaves": [
    [1.0, 0.5, 0.2], // Orange
    [0.9, 0.3, 0.1], // Red orange
    [1.0, 0.7, 0.3], // Golden
    [0.8, 0.2, 0.1], // Deep red
    [0.7, 0.4, 0.1], // Brown
  ],
  "Midnight Aurora": [
    [0.2, 0.3, 0.8], // Deep blue
    [0.4, 0.2, 0.9], // Purple
    [0.6, 0.8, 0.9], // Light blue
    [0.3, 0.9, 0.7], // Cyan
    [0.1, 0.2, 0.6], // Dark blue
  ],
  "Coral Reef": [
    [1.0, 0.4, 0.5], // Coral
    [1.0, 0.6, 0.4], // Peach
    [0.9, 0.8, 0.6], // Cream
    [0.4, 0.8, 0.9], // Aqua
    [0.6, 0.9, 0.8], // Mint
  ],
  "Desert Mirage": [
    [1.0, 0.8, 0.4], // Sand
    [1.0, 0.6, 0.3], // Orange
    [0.9, 0.4, 0.2], // Rust
    [0.8, 0.7, 0.5], // Beige
    [0.7, 0.5, 0.3], // Brown
  ],
  "Cherry Blossom": [
    [1.0, 0.7, 0.8], // Light pink
    [0.9, 0.5, 0.7], // Pink
    [1.0, 0.9, 0.9], // Very light pink
    [0.8, 0.4, 0.6], // Rose
    [0.9, 0.8, 0.8], // Blush
  ],
  "Northern Lights": [
    [0.3, 0.9, 0.6], // Green
    [0.2, 0.7, 0.9], // Blue
    [0.6, 0.3, 0.9], // Purple
    [0.9, 0.9, 0.3], // Yellow
    [0.1, 0.5, 0.8], // Dark blue
  ],
}

export const PALETTE_NAMES = Object.keys(COLOR_PALETTES)

export function getRandomPalette(): number[][] {
  const names = PALETTE_NAMES
  const randomName = names[Math.floor(Math.random() * names.length)]
  return COLOR_PALETTES[randomName as keyof typeof COLOR_PALETTES]
}

export function generateHarmoniousPalette(): number[][] {
  // Generate a palette based on color theory
  const baseHue = Math.random()
  const colors: number[][] = []

  // Analogous colors (colors next to each other on color wheel)
  for (let i = 0; i < 5; i++) {
    const hue = (baseHue + i * 0.1) % 1
    const saturation = 0.6 + Math.random() * 0.3
    const lightness = 0.5 + Math.random() * 0.3

    // Convert HSL to RGB
    const rgb = hslToRgb(hue, saturation, lightness)
    colors.push(rgb)
  }

  return colors
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

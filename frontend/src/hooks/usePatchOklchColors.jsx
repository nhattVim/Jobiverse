import { useEffect } from 'react'
import { oklch, rgb, formatRgb } from 'culori'

export default function usePatchOklchColors(rootSelector = '*') {
  useEffect(() => {
    const elements = document.querySelectorAll(rootSelector)

    elements.forEach(el => {
      const computedStyle = getComputedStyle(el)
      const styleOverrides = {}

      for (let prop of computedStyle) {
        const value = computedStyle.getPropertyValue(prop)
        if (value.includes('oklch')) {
          const match = value.match(/oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/)
          if (match) {
            const [_, lPerc, c, h] = match
            const lightness = parseFloat(lPerc) / 100
            const chroma = parseFloat(c)
            const hue = parseFloat(h)

            try {
              const rgbColor = formatRgb(rgb(oklch({ l: lightness, c: chroma, h: hue })))
              styleOverrides[prop] = rgbColor
            } catch (err) {
              console.warn(`❌ Error converting ${value}`, err)
            }
          } else {
            console.warn(`❌ No regex match for: ${value}`)
          }
        }
      }

      Object.entries(styleOverrides).forEach(([prop, val]) => {
        el.style.setProperty(prop, val)
        console.log(`✅ Patched ${prop} to ${val} on`, el)
      })
    })
  }, [rootSelector])
}

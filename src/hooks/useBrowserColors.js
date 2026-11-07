import { useEffect } from 'react'

// Average colour of a horizontal strip of the image (fractions of its height),
// taken from the middle half of the width — the part `background-size: cover` keeps on phones
function stripColor(ctx, width, height, from, to) {
  const x = Math.floor(width / 4)
  const y = Math.floor(height * from)
  const { data } = ctx.getImageData(x, y, Math.ceil(width / 2), Math.max(1, Math.ceil(height * (to - from))))
  let r = 0
  let g = 0
  let b = 0
  for (let i = 0; i < data.length; i += 4) {
    r += data[i]
    g += data[i + 1]
    b += data[i + 2]
  }
  const n = data.length / 4
  const hex = (v) => Math.round(v / n).toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

// Mobile breakpoint — keep in sync with App.css
const MOBILE_QUERY = '(max-width: 767px)'
const MOBILE_COLOR = '#ffffff'

function applyColors(themeColor, pageColor) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor)
  document.documentElement.style.backgroundColor = pageColor
}

// Tints the browser UI to the selected background: Safari's bars use theme-color,
// overscroll areas show the page colour. Colours come from the small preview image.
// On phones the bars and safe areas are white instead, whatever the background.
export function useBrowserColors(imageSrc) {
  useEffect(() => {
    if (!imageSrc) return

    let cancelled = false
    let colors = null
    const mobile = window.matchMedia(MOBILE_QUERY)
    const update = () => {
      if (mobile.matches) applyColors(MOBILE_COLOR, MOBILE_COLOR)
      else if (colors) applyColors(colors.top, colors.whole)
    }
    update()
    mobile.addEventListener('change', update)

    const img = new Image()
    img.onload = () => {
      if (cancelled) return
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0)

      colors = {
        top: stripColor(ctx, canvas.width, canvas.height, 0, 0.08),
        whole: stripColor(ctx, canvas.width, canvas.height, 0, 1),
      }
      update()
    }
    img.src = imageSrc

    return () => {
      cancelled = true
      mobile.removeEventListener('change', update)
    }
  }, [imageSrc])
}

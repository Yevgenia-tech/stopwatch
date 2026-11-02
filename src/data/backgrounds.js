// ─────────────────────────────────────────────────────────────────────────────
//  BACKGROUNDS LIST
//
//  Images live in:  src/assets/backgrounds/
//  Supported formats: .png  .jpg  .jpeg  .webp  .avif
//
//  • Add:      put the image into the folder, then add a line below.
//  • Remove:   delete the line below (and the file from the folder, if unused).
//  • Replace:  overwrite the file in the folder, keeping the same file name.
//  • Reorder:  move the lines — the popup shows them top to bottom.
//
//  The FIRST line is the default background.
//  Popup previews are generated automatically — no thumbnails to make by hand.
//  Full guide: README.md → «Фоновые изображения».
// ─────────────────────────────────────────────────────────────────────────────

const backgroundList = [
  { file: 'clouds.png', label: 'Pastel clouds' },
  { file: 'flowers.png', label: 'Flower field' },
  { file: 'violet.png', label: 'Violet abstract' },
  { file: 'Image_4.png', label: 'Blue glow' },
  { file: 'Image_5.png', label: 'Green leaves' },
]

// ── Nothing to edit below this line ─────────────────────────────────────────

// Full-size backgrounds are re-encoded to WebP at build time; the originals stay untouched
const fullImages = import.meta.glob('../assets/backgrounds/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
  query: { format: 'webp', quality: 82 },
})
const previewImages = import.meta.glob('../assets/backgrounds/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
  query: { w: 336, format: 'jpg', quality: 82 },
})

export const backgrounds = backgroundList.flatMap(({ file, label }) => {
  const path = `../assets/backgrounds/${file}`
  if (!fullImages[path]) {
    console.warn(`[backgrounds] "${file}" was not found in src/assets/backgrounds/ — skipped.`)
    return []
  }
  return [
    {
      // File name without extension — also used to remember the user's choice
      id: file.replace(/\.[^.]+$/, ''),
      label,
      src: fullImages[path],
      thumb: previewImages[path],
    },
  ]
})

export const defaultBackgroundId = backgrounds[0]?.id ?? null

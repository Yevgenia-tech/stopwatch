import { useEffect, useRef, useState } from 'react'
import Stopwatch from './components/Stopwatch'
import SettingsButton from './components/SettingsButton'
import BackgroundPicker from './components/BackgroundPicker'
import { backgrounds, defaultBackgroundId } from './data/backgrounds'
import './App.css'

const STORAGE_KEY = 'stopwatch:background'

function readSavedBackground() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return backgrounds.some((b) => b.id === saved) ? saved : defaultBackgroundId
  } catch {
    return defaultBackgroundId
  }
}

// Figma: Desktop_Timer_1 (46:182) / Mobile_Timer_1 (46:192),
// popup states from Final Design → Interactions
export default function App() {
  const [backgroundId, setBackgroundId] = useState(readSavedBackground)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const pickerRef = useRef(null)
  const settingsRef = useRef(null)

  const background = backgrounds.find((b) => b.id === backgroundId)

  const selectBackground = (id) => {
    setBackgroundId(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // Storage unavailable (private mode) — selection still applies for this visit
    }
  }

  const closePicker = () => {
    setIsPickerOpen(false)
    settingsRef.current?.focus()
  }

  useEffect(() => {
    if (!isPickerOpen) return

    // Warm up full-size images so switching is instant
    backgrounds.forEach((b) => {
      new Image().src = b.src
    })

    const onPointerDown = (event) => {
      if (pickerRef.current?.contains(event.target)) return
      if (settingsRef.current?.contains(event.target)) return
      setIsPickerOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsPickerOpen(false)
        settingsRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isPickerOpen])

  return (
    <main className="app" style={background ? { backgroundImage: `url(${background.src})` } : undefined}>
      <Stopwatch />
      <div className="app__settings">
        <SettingsButton
          ref={settingsRef}
          aria-expanded={isPickerOpen}
          aria-controls="background-picker"
          onClick={() => setIsPickerOpen((open) => !open)}
        />
      </div>
      {isPickerOpen && (
        <BackgroundPicker
          ref={pickerRef}
          id="background-picker"
          backgrounds={backgrounds}
          selectedId={backgroundId}
          onSelect={selectBackground}
          onClose={closePicker}
        />
      )}
    </main>
  )
}

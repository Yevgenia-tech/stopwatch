import { useCallback, useEffect, useRef, useState } from 'react'

// Elapsed time is derived from timestamps, so throttled tabs don't drift.
export function useStopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const startedAtRef = useRef(0)
  const accumulatedRef = useRef(0)

  useEffect(() => {
    if (!isRunning) return

    let frameId
    const tick = () => {
      const next = accumulatedRef.current + (performance.now() - startedAtRef.current)
      // Re-render only when the displayed second changes
      setElapsed((prev) => (Math.floor(prev / 1000) === Math.floor(next / 1000) ? prev : next))
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameId)
  }, [isRunning])

  const toggle = useCallback(() => {
    if (isRunning) {
      accumulatedRef.current += performance.now() - startedAtRef.current
      setElapsed(accumulatedRef.current)
      setIsRunning(false)
    } else {
      startedAtRef.current = performance.now()
      setIsRunning(true)
    }
  }, [isRunning])

  const clear = useCallback(() => {
    accumulatedRef.current = 0
    setElapsed(0)
    setIsRunning(false)
  }, [])

  return { elapsed, isRunning, toggle, clear }
}

// HH:MM:SS — hours, minutes, seconds
export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const seconds = totalSeconds % 60
  const minutes = Math.floor(totalSeconds / 60) % 60
  const hours = Math.floor(totalSeconds / 3600)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

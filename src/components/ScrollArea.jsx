import { useCallback, useEffect, useRef, useState } from 'react'
import './ScrollArea.css'

// Figma: Scroll (59:300). Native scrollbar is hidden; the custom track is shown
// only when content overflows, and the thumb size follows visible/total ratio.
export default function ScrollArea({ className = '', trackClassName = '', children }) {
  const viewportRef = useRef(null)
  const contentRef = useRef(null)
  const trackRef = useRef(null)
  const [thumb, setThumb] = useState({ visible: false, size: 0, offset: 0 })

  const update = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const { clientHeight, scrollHeight, scrollTop } = viewport
    const overflows = scrollHeight - clientHeight > 1
    if (!overflows) {
      setThumb((prev) => (prev.visible ? { visible: false, size: 0, offset: 0 } : prev))
      return
    }

    const trackStyle = getComputedStyle(track)
    const trackHeight =
      track.clientHeight - parseFloat(trackStyle.paddingTop) - parseFloat(trackStyle.paddingBottom)
    const size = Math.max(24, (clientHeight / scrollHeight) * trackHeight)
    const maxOffset = trackHeight - size
    const offset = (scrollTop / (scrollHeight - clientHeight)) * maxOffset
    setThumb({ visible: true, size, offset })
  }, [])

  useEffect(() => {
    const observer = new ResizeObserver(update)
    observer.observe(viewportRef.current)
    observer.observe(contentRef.current)
    update()
    return () => observer.disconnect()
  }, [update])

  const handleThumbPointerDown = (event) => {
    event.preventDefault()
    const viewport = viewportRef.current
    const startY = event.clientY
    const startScrollTop = viewport.scrollTop
    const trackHeight = trackRef.current.clientHeight
    const scrollPerPixel =
      (viewport.scrollHeight - viewport.clientHeight) / Math.max(1, trackHeight - thumb.size)

    const onMove = (moveEvent) => {
      viewport.scrollTop = startScrollTop + (moveEvent.clientY - startY) * scrollPerPixel
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <>
      <div ref={viewportRef} className={`scroll-area ${className}`} onScroll={update}>
        <div ref={contentRef}>{children}</div>
      </div>
      <div
        ref={trackRef}
        className={`scroll-area__track ${trackClassName}${thumb.visible ? '' : ' is-hidden'}`}
        aria-hidden="true"
      >
        <div
          className="scroll-area__thumb"
          style={{ height: thumb.size, transform: `translateY(${thumb.offset}px)` }}
          onPointerDown={handleThumbPointerDown}
        />
      </div>
    </>
  )
}

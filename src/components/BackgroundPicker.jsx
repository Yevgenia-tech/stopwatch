import { forwardRef } from 'react'
import closeIcon from '../assets/icon-close.svg'
import ScrollArea from './ScrollArea'
import './BackgroundPicker.css'

// Desktop shows up to 3 rows × 2 tiles; beyond that the Overflow=True layout applies
const DESKTOP_MAX_VISIBLE_TILES = 6

// Figma: Settings_Images (Device=Desktop / Mobile, Overflow=False / True)
// with Variable_Image tiles (State=Default / Hover / Active)
const BackgroundPicker = forwardRef(function BackgroundPicker(
  { id, backgrounds, selectedId, onSelect, onClose },
  ref,
) {
  const isOverflow = backgrounds.length > DESKTOP_MAX_VISIBLE_TILES

  return (
    <div
      ref={ref}
      id={id}
      className={`bg-picker${isOverflow ? ' bg-picker--overflow' : ''}`}
      role="dialog"
      aria-labelledby={`${id}-title`}
    >
      <p id={`${id}-title`} className="bg-picker__title">
        Background images
      </p>
      <button type="button" className="bg-picker__close" aria-label="Close" onClick={onClose}>
        <img src={closeIcon} alt="" width="20" height="20" />
      </button>
      <ScrollArea className="bg-picker__scroll" trackClassName="bg-picker__track">
        <ul className="bg-picker__grid">
          {backgrounds.map((background) => {
            const isActive = background.id === selectedId
            return (
              <li key={background.id}>
                <button
                  type="button"
                  className={`bg-picker__tile${isActive ? ' is-active' : ''}`}
                  aria-label={background.label}
                  aria-pressed={isActive}
                  onClick={() => onSelect(background.id)}
                >
                  <img src={background.thumb} alt="" draggable="false" />
                </button>
              </li>
            )
          })}
        </ul>
      </ScrollArea>
    </div>
  )
})

export default BackgroundPicker

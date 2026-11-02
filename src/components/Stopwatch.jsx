import { formatTime, useStopwatch } from '../hooks/useStopwatch'
import './Stopwatch.css'

// Figma: Stopwatch (Device=Desktop / Device=Mobile), Start_Button (State=Start / Pause), Clear_Button
export default function Stopwatch() {
  const { elapsed, isRunning, toggle, clear } = useStopwatch()

  return (
    <section className="stopwatch" aria-label="Stopwatch">
      <div className="stopwatch__container">
        <div className="stopwatch__numbers">
          <p className="stopwatch__label">Stopwatch</p>
          <p className="stopwatch__time" role="timer" aria-live="off">
            {formatTime(elapsed)}
          </p>
        </div>
        <div className="stopwatch__buttons">
          <button
            type="button"
            className={`stopwatch__button stopwatch__button--start${isRunning ? ' is-pause' : ''}`}
            onClick={toggle}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            type="button"
            className="stopwatch__button stopwatch__button--clear"
            onClick={clear}
          >
            Clear
          </button>
        </div>
      </div>
    </section>
  )
}

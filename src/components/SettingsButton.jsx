import { forwardRef } from 'react'
import settingsIcon from '../assets/icon-settings.svg'
import './SettingsButton.css'

// Figma: Circle_Button with Icons/Settings
const SettingsButton = forwardRef(function SettingsButton(props, ref) {
  return (
    <button ref={ref} type="button" className="settings-button" aria-label="Settings" {...props}>
      <img src={settingsIcon} alt="" width="16" height="16" />
    </button>
  )
})

export default SettingsButton

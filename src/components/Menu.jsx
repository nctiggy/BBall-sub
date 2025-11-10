import { useState, useEffect, useRef } from 'react'
import './Menu.css'

function Menu({ onAddPlayer }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  const handleMenuItemClick = (action) => {
    action()
    setIsOpen(false)
  }

  return (
    <div className="menu-container" ref={menuRef}>
      <button
        className="menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        ☰
      </button>

      {isOpen && (
        <div className="menu-dropdown">
          <button
            className="menu-item"
            onClick={() => handleMenuItemClick(onAddPlayer)}
          >
            <span className="menu-icon">➕</span>
            <span className="menu-text">Add Player</span>
          </button>

          {/* Future menu items can be added here */}
          {/*
          <button className="menu-item" onClick={() => handleMenuItemClick(onClearAll)}>
            <span className="menu-icon">🗑️</span>
            <span className="menu-text">Clear All</span>
          </button>
          */}
        </div>
      )}
    </div>
  )
}

export default Menu

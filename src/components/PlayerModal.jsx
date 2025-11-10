import { useState } from 'react'
import './PlayerModal.css'

function PlayerModal({ isOpen, onClose, onAddPlayer }) {
  const [playerName, setPlayerName] = useState('')

  const handleNameChange = (e) => {
    const input = e.target.value
    // Capitalize first letter of each word
    const capitalized = input
      .split(' ')
      .map(word => {
        if (word.length === 0) return word
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(' ')
    setPlayerName(capitalized)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (playerName.trim()) {
      onAddPlayer(playerName)
      setPlayerName('')
      onClose()
    }
  }

  const handleClose = () => {
    setPlayerName('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Player</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={playerName}
            onChange={handleNameChange}
            placeholder="Enter player name"
            className="modal-input"
            autoFocus
          />
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add to Team
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlayerModal

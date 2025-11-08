import { useState } from 'react'
import './AddPlayer.css'

function AddPlayer({ onAddPlayer }) {
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
    }
  }

  return (
    <div className="add-player">
      <h2>Add Player</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={playerName}
          onChange={handleNameChange}
          placeholder="Enter player name"
          className="player-input"
        />
        <button type="submit" className="add-button">
          Add to Team
        </button>
      </form>
    </div>
  )
}

export default AddPlayer

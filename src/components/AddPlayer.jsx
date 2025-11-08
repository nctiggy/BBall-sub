import { useState } from 'react'
import './AddPlayer.css'

function AddPlayer({ onAddPlayer }) {
  const [playerName, setPlayerName] = useState('')

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
          onChange={(e) => setPlayerName(e.target.value)}
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

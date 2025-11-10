import './Bench.css'

// Format time in MM:SS
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function Bench({ players, onDeletePlayer }) {
  const handleDragStart = (e, player) => {
    e.dataTransfer.setData('player', JSON.stringify(player))
    // Store player data globally for touch devices
    window.draggedPlayer = player
  }

  const handleTouchStart = (e, player) => {
    // Don't start drag if touching a button
    if (e.target.classList.contains('delete-player')) {
      return
    }

    // Start drag immediately for better responsiveness
    window.draggedPlayer = player
    window.isDragging = true
    window.touchStartTime = Date.now()

    // Get the touch target element
    const target = e.currentTarget
    target.classList.add('dragging')
  }

  const handleTouchEnd = (e) => {
    const target = e.currentTarget
    target.classList.remove('dragging')

    // Only clear if not a quick tap
    const touchDuration = Date.now() - (window.touchStartTime || 0)
    if (touchDuration > 100) {
      window.isDragging = false
      window.draggedPlayer = null
    }
  }

  const handleDeleteClick = (player) => {
    if (window.confirm(`Are you sure you want to delete ${player.name} from the team?`)) {
      onDeletePlayer(player.id)
    }
  }

  return (
    <div className="bench">
      <h2>Bench ({players.length})</h2>
      <div className="bench-players">
        {players.length === 0 ? (
          <div className="empty-bench">
            <p>No players on bench</p>
            <p className="hint">Add players above or remove them from the court</p>
          </div>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              className="bench-player"
              draggable
              onDragStart={(e) => handleDragStart(e, player)}
              onTouchStart={(e) => handleTouchStart(e, player)}
              onTouchEnd={handleTouchEnd}
            >
              <div className="player-avatar">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="player-details">
                <span className="player-name">{player.name}</span>
                <span className="player-total-time">
                  Total: {formatTime(player.totalTimeOnCourt || 0)}
                </span>
              </div>
              <button
                className="delete-player"
                onClick={() => handleDeleteClick(player)}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                title="Delete player"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Bench

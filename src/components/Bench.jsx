import './Bench.css'

// Format time in MM:SS
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function Bench({ players, onDeletePlayer, selectedPlayer, onPlayerClick }) {
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

    // Store player but don't mark as dragging yet (allow scrolling)
    window.draggedPlayer = player
    window.isDragging = false
    window.touchStartTime = Date.now()

    // Store initial touch position to detect drag vs scroll
    const touch = e.touches[0]
    window.touchStartX = touch.clientX
    window.touchStartY = touch.clientY
  }

  const handleTouchMove = (e, player) => {
    if (!window.draggedPlayer) return

    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - window.touchStartX)
    const deltaY = Math.abs(touch.clientY - window.touchStartY)

    // If moving more horizontally than vertically, start dragging
    if (deltaX > 10 && deltaX > deltaY && !window.isDragging) {
      window.isDragging = true
      e.currentTarget.classList.add('dragging')
    }
  }

  const handleTouchEnd = (e) => {
    const target = e.currentTarget
    target.classList.remove('dragging')

    // Clear dragging state
    window.isDragging = false
    window.draggedPlayer = null
  }

  const handleDeleteClick = (player) => {
    if (window.confirm(`Are you sure you want to delete ${player.name} from the team?`)) {
      onDeletePlayer(player.id)
    }
  }

  return (
    <div className="bench">
      <h2>
        Bench ({players.length})
        {selectedPlayer && !selectedPlayer.onCourt && (
          <span className="hint-text"> - Click court position</span>
        )}
      </h2>
      <div className="bench-players">
        {players.length === 0 ? (
          <div className="empty-bench">
            <p>No players on bench</p>
            <p className="hint">Add players above or remove them from the court</p>
          </div>
        ) : (
          players.map((player) => {
            const isSelected = selectedPlayer?.id === player.id
            return (
              <div
                key={player.id}
                className={`bench-player ${isSelected ? 'selected' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, player)}
                onTouchStart={(e) => handleTouchStart(e, player)}
                onTouchMove={(e) => handleTouchMove(e, player)}
                onTouchEnd={handleTouchEnd}
                onClick={() => onPlayerClick(player)}
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
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteClick(player)
                }}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                title="Delete player"
              >
                ×
              </button>
            </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Bench

import './Bench.css'

function Bench({ players, onDeletePlayer }) {
  const handleDragStart = (e, player) => {
    e.dataTransfer.setData('player', JSON.stringify(player))
    // Store player data globally for touch devices
    window.draggedPlayer = player
  }

  const handleTouchStart = (e, player) => {
    // Store player data for touch events
    window.draggedPlayer = player
    window.isDragging = true

    // Get the touch target element
    const target = e.currentTarget
    target.classList.add('dragging')
  }

  const handleTouchEnd = (e) => {
    const target = e.currentTarget
    target.classList.remove('dragging')
    window.isDragging = false
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
              <span className="player-name">{player.name}</span>
              <button
                className="delete-player"
                onClick={() => handleDeleteClick(player)}
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

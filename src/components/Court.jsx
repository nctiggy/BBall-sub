import { useState, useEffect } from 'react'
import './Court.css'

// Map positions to their numbers
const POSITION_NUMBERS = {
  'Point Guard': 1,
  'Shooting Guard': 2,
  'Small Forward': 3,
  'Power Forward': 4,
  'Center': 5
}

// Format time in MM:SS
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function Court({ courtPlayers, positions, onDrop, onRemoveFromCourt, onAddSubstitution, benchPlayers, gameActive, players, selectedPlayer, onPlayerClick, onPositionClick }) {
  const [dragOverPosition, setDragOverPosition] = useState(null)
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Update current time every second when game is active
  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now())
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [gameActive])

  const handleDragOver = (e, position) => {
    e.preventDefault()
    setDragOverPosition(position)
  }

  const handleDragLeave = () => {
    setDragOverPosition(null)
  }

  const handleDrop = (e, position) => {
    e.preventDefault()
    const playerData = e.dataTransfer.getData('player')
    if (playerData) {
      const player = JSON.parse(playerData)
      onDrop(position, player)
    }
    setDragOverPosition(null)
  }

  const handleTouchMove = (e, position) => {
    // Provide visual feedback when dragging over a position
    if (window.isDragging) {
      e.preventDefault()
      setDragOverPosition(position)
    }
  }

  const handleTouchEnd = (e, position) => {
    // Don't prevent default if touching a button - let the click handler work
    const target = e.target
    const isButton = target.tagName === 'BUTTON' || target.closest('button')

    if (!isButton) {
      e.preventDefault()

      // Check if we have a dragged player from touch event
      if (window.draggedPlayer && window.isDragging) {
        const player = window.draggedPlayer
        onDrop(position, player)

        // Clean up
        window.draggedPlayer = null
        window.isDragging = false
      }
    }

    setDragOverPosition(null)
  }

  return (
    <div className="court-container">
      <h2>
        Basketball Court
        {selectedPlayer && selectedPlayer.onCourt && (
          <span className="hint-text"> - Click position to swap</span>
        )}
        {selectedPlayer && !selectedPlayer.onCourt && (
          <span className="hint-text"> - Click position to place</span>
        )}
      </h2>
      <div className="court">
        {positions.map((position) => {
          const player = courtPlayers[position]
          const isHovered = dragOverPosition === position

          // Get full player data including time tracking
          const fullPlayer = player ? players.find(p => p.id === player.id) : null
          const isPlayerSelected = selectedPlayer && fullPlayer && selectedPlayer.id === fullPlayer.id

          // Calculate current stint time
          let currentStintTime = 0
          let totalPlayTime = 0
          if (fullPlayer) {
            // Add accumulated stint time
            currentStintTime = fullPlayer.currentStintTime || 0
            // If game is active and player has started tracking, add elapsed time
            if (gameActive && fullPlayer.timeOnCourtStart) {
              currentStintTime += (currentTime - fullPlayer.timeOnCourtStart)
            }
            // Calculate total play time (previous total + current stint)
            totalPlayTime = (fullPlayer.totalTimeOnCourt || 0) + currentStintTime
          }

          return (
            <div
              key={position}
              className={`court-position ${isHovered ? 'drag-over' : ''} ${player ? 'occupied' : 'empty'} ${isPlayerSelected ? 'selected' : ''}`}
              onDragOver={(e) => handleDragOver(e, position)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, position)}
              onTouchMove={(e) => handleTouchMove(e, position)}
              onTouchEnd={(e) => handleTouchEnd(e, position)}
              onClick={() => {
                if (selectedPlayer) {
                  // If we have a selected player, execute the action (sub/swap/move)
                  onPositionClick(position)
                } else if (player) {
                  // Otherwise, select the player in this position
                  onPlayerClick(fullPlayer)
                }
              }}
            >
              <div className="position-label">
                <span className="position-number">{POSITION_NUMBERS[position]}</span> {position}
              </div>
              {player ? (
                <div className="player-on-court">
                  <div className="player-info">
                    <span className="player-name">{player.name}</span>
                    {fullPlayer && currentStintTime > 0 && (
                      <span className="player-time">
                        {formatTime(currentStintTime)} / {formatTime(totalPlayTime)}
                      </span>
                    )}
                  </div>
                  <button
                    className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveFromCourt(position)
                    }}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="empty-position">
                  <p>{selectedPlayer ? 'Click to place here' : 'Drag player here or click to select'}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Court

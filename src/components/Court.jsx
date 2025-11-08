import { useState } from 'react'
import './Court.css'

// Map positions to their numbers
const POSITION_NUMBERS = {
  'Point Guard': 1,
  'Shooting Guard': 2,
  'Small Forward': 3,
  'Power Forward': 4,
  'Center': 5
}

function Court({ courtPlayers, positions, onDrop, onRemoveFromCourt, onAddSubstitution, benchPlayers }) {
  const [dragOverPosition, setDragOverPosition] = useState(null)
  const [showSubMenu, setShowSubMenu] = useState(null)

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

  const handleSubstitution = (position, playerIn) => {
    const playerOut = courtPlayers[position]
    if (playerOut) {
      onAddSubstitution(playerOut, playerIn, position)
      setShowSubMenu(null)
    }
  }

  return (
    <div className="court-container">
      <h2>Basketball Court</h2>
      <div className="court">
        {positions.map((position) => {
          const player = courtPlayers[position]
          const isHovered = dragOverPosition === position

          return (
            <div
              key={position}
              className={`court-position ${isHovered ? 'drag-over' : ''} ${player ? 'occupied' : 'empty'}`}
              onDragOver={(e) => handleDragOver(e, position)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, position)}
            >
              <div className="position-label">
                <span className="position-number">{POSITION_NUMBERS[position]}</span> {position}
              </div>
              {player ? (
                <div className="player-on-court">
                  <div className="player-info">
                    <span className="player-name">{player.name}</span>
                  </div>
                  <div className="player-actions">
                    <button
                      className="sub-button"
                      onClick={() => setShowSubMenu(showSubMenu === position ? null : position)}
                    >
                      Sub
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => onRemoveFromCourt(position)}
                    >
                      ×
                    </button>
                  </div>
                  {showSubMenu === position && benchPlayers.length > 0 && (
                    <div className="sub-menu">
                      <div className="sub-menu-header">Substitute with:</div>
                      {benchPlayers.map((benchPlayer) => (
                        <div
                          key={benchPlayer.id}
                          className="sub-menu-item"
                          onClick={() => handleSubstitution(position, benchPlayer)}
                        >
                          {benchPlayer.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-position">
                  <p>Drag player here</p>
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

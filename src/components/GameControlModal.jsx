import './GameControlModal.css'

function GameControlModal({ isOpen, onClose, gameActive, onStartGame, onStopGame, onResetStats }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Game Control</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="game-status">
          <div className={`status-indicator ${gameActive ? 'active' : 'inactive'}`}>
            <div className="status-dot"></div>
            <span>{gameActive ? 'Game Active' : 'Game Stopped'}</span>
          </div>
        </div>

        <div className="game-controls">
          {!gameActive ? (
            <button className="control-button start-button" onClick={onStartGame}>
              ▶ Start Game
            </button>
          ) : (
            <button className="control-button stop-button" onClick={onStopGame}>
              ■ Stop Game
            </button>
          )}

          <button className="control-button reset-button" onClick={onResetStats}>
            🔄 Reset Statistics
          </button>
        </div>

        <div className="game-info">
          <p>
            {gameActive
              ? 'Time tracking is active for players on court.'
              : 'Start the game to begin tracking player time on court.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default GameControlModal

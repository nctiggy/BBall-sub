import './Bench.css'

function Bench({ players, onDeletePlayer }) {
  const handleDragStart = (e, player) => {
    e.dataTransfer.setData('player', JSON.stringify(player))
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
            >
              <div className="player-avatar">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <span className="player-name">{player.name}</span>
              <button
                className="delete-player"
                onClick={() => onDeletePlayer(player.id)}
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

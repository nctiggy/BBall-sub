import './SubstitutionManager.css'

function SubstitutionManager({ substitutions, onRemoveSubstitution, onExecuteSubstitutions }) {
  return (
    <div className="substitution-manager">
      <h2>Pending Substitutions</h2>
      <div className="substitution-list">
        {substitutions.length === 0 ? (
          <div className="empty-subs">
            <p>No pending substitutions</p>
            <p className="hint">Click "Sub" button on court players to add substitutions</p>
          </div>
        ) : (
          <>
            {substitutions.map((sub) => (
              <div key={sub.id} className="substitution-item">
                <div className="sub-header">{sub.position}</div>
                <div className="sub-details">
                  <div className="player-out">
                    <span className="label">Out:</span>
                    <span className="player-name">{sub.playerOut.name}</span>
                  </div>
                  <div className="arrow">→</div>
                  <div className="player-in">
                    <span className="label">In:</span>
                    <span className="player-name">{sub.playerIn.name}</span>
                  </div>
                </div>
                <button
                  className="remove-sub"
                  onClick={() => onRemoveSubstitution(sub.id)}
                  title="Remove this substitution"
                >
                  Cancel
                </button>
              </div>
            ))}
            <button
              className="execute-button"
              onClick={onExecuteSubstitutions}
            >
              Execute All Substitutions ({substitutions.length})
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default SubstitutionManager

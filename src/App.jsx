import { useState } from 'react'
import AddPlayer from './components/AddPlayer'
import Court from './components/Court'
import Bench from './components/Bench'
import SubstitutionManager from './components/SubstitutionManager'
import './App.css'

const POSITIONS = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center']

function App() {
  const [players, setPlayers] = useState([])
  const [courtPlayers, setCourtPlayers] = useState({
    'Point Guard': null,
    'Shooting Guard': null,
    'Small Forward': null,
    'Power Forward': null,
    'Center': null
  })
  const [pendingSubstitutions, setPendingSubstitutions] = useState([])

  const addPlayer = (playerName) => {
    if (playerName.trim()) {
      const newPlayer = {
        id: Date.now(),
        name: playerName,
        onCourt: false
      }
      setPlayers([...players, newPlayer])
    }
  }

  const deletePlayer = (playerId) => {
    // Remove from players list
    setPlayers(players.filter(p => p.id !== playerId))

    // Remove from court if they're on it
    const updatedCourt = { ...courtPlayers }
    Object.keys(updatedCourt).forEach(position => {
      if (updatedCourt[position]?.id === playerId) {
        updatedCourt[position] = null
      }
    })
    setCourtPlayers(updatedCourt)

    // Remove from pending substitutions
    setPendingSubstitutions(pendingSubstitutions.filter(
      sub => sub.playerOut.id !== playerId && sub.playerIn.id !== playerId
    ))
  }

  const handleDrop = (position, player) => {
    const currentPlayerInPosition = courtPlayers[position]
    const isPlayerOnBench = !player.onCourt

    // If dragging a bench player over an occupied position, create a substitution instead
    if (currentPlayerInPosition && isPlayerOnBench) {
      addSubstitution(currentPlayerInPosition, player, position)
      return
    }

    // If player is already on court in a different position, remove them from there
    const updatedCourt = { ...courtPlayers }
    Object.keys(updatedCourt).forEach(pos => {
      if (updatedCourt[pos]?.id === player.id) {
        updatedCourt[pos] = null
      }
    })

    // Place player in new position
    updatedCourt[position] = player
    setCourtPlayers(updatedCourt)

    // Update player statuses in a single operation
    setPlayers(players.map(p => {
      if (p.id === player.id) {
        return { ...p, onCourt: true }
      }
      if (currentPlayerInPosition && p.id === currentPlayerInPosition.id) {
        return { ...p, onCourt: false }
      }
      return p
    }))
  }

  const removeFromCourt = (position) => {
    const player = courtPlayers[position]
    if (player) {
      setCourtPlayers({ ...courtPlayers, [position]: null })
      setPlayers(players.map(p =>
        p.id === player.id ? { ...p, onCourt: false } : p
      ))
    }
  }

  const addSubstitution = (playerOut, playerIn, position) => {
    const newSub = {
      id: Date.now(),
      playerOut,
      playerIn,
      position
    }
    setPendingSubstitutions([...pendingSubstitutions, newSub])
  }

  const removeSubstitution = (subId) => {
    setPendingSubstitutions(pendingSubstitutions.filter(sub => sub.id !== subId))
  }

  const executeSubstitutions = () => {
    const updatedCourt = { ...courtPlayers }
    const updatedPlayers = [...players]

    pendingSubstitutions.forEach(sub => {
      // Update court
      updatedCourt[sub.position] = sub.playerIn

      // Update player statuses
      const playerOutIndex = updatedPlayers.findIndex(p => p.id === sub.playerOut.id)
      const playerInIndex = updatedPlayers.findIndex(p => p.id === sub.playerIn.id)

      if (playerOutIndex !== -1) {
        updatedPlayers[playerOutIndex] = { ...updatedPlayers[playerOutIndex], onCourt: false }
      }
      if (playerInIndex !== -1) {
        updatedPlayers[playerInIndex] = { ...updatedPlayers[playerInIndex], onCourt: true }
      }
    })

    setCourtPlayers(updatedCourt)
    setPlayers(updatedPlayers)
    setPendingSubstitutions([])
  }

  const benchPlayers = players.filter(p => !p.onCourt)

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏀 Basketball Substitution Manager</h1>
      </header>

      <div className="app-content">
        <div className="left-panel">
          <AddPlayer onAddPlayer={addPlayer} />
          <Bench
            players={benchPlayers}
            onDeletePlayer={deletePlayer}
          />
        </div>

        <div className="center-panel">
          <Court
            courtPlayers={courtPlayers}
            positions={POSITIONS}
            onDrop={handleDrop}
            onRemoveFromCourt={removeFromCourt}
            onAddSubstitution={addSubstitution}
            benchPlayers={benchPlayers}
          />
        </div>

        <div className="right-panel">
          <SubstitutionManager
            substitutions={pendingSubstitutions}
            onRemoveSubstitution={removeSubstitution}
            onExecuteSubstitutions={executeSubstitutions}
          />
        </div>
      </div>
    </div>
  )
}

export default App

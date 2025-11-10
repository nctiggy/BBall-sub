import { useState, useEffect } from 'react'
import Court from './components/Court'
import Bench from './components/Bench'
import SubstitutionManager from './components/SubstitutionManager'
import PlayerModal from './components/PlayerModal'
import './App.css'
import packageJson from '../package.json'

const POSITIONS = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center']
const STORAGE_KEY = 'basketball-sub-data'

// Helper functions for localStorage
const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }
  return null
}

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

function App() {
  // Load initial state from localStorage
  const savedData = loadFromStorage()

  const [players, setPlayers] = useState(savedData?.players || [])
  const [courtPlayers, setCourtPlayers] = useState(savedData?.courtPlayers || {
    'Point Guard': null,
    'Shooting Guard': null,
    'Small Forward': null,
    'Power Forward': null,
    'Center': null
  })
  const [pendingSubstitutions, setPendingSubstitutions] = useState(savedData?.pendingSubstitutions || [])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage({
      players,
      courtPlayers,
      pendingSubstitutions
    })
  }, [players, courtPlayers, pendingSubstitutions])

  // Reconcile player onCourt status with courtPlayers to ensure consistency
  useEffect(() => {
    // Get all player IDs currently on court
    const playersOnCourt = new Set(
      Object.values(courtPlayers)
        .filter(p => p !== null)
        .map(p => p.id)
    )

    // Update any players whose onCourt status doesn't match reality
    const needsUpdate = players.some(p => {
      const shouldBeOnCourt = playersOnCourt.has(p.id)
      return p.onCourt !== shouldBeOnCourt
    })

    if (needsUpdate) {
      setPlayers(players.map(p => ({
        ...p,
        onCourt: playersOnCourt.has(p.id)
      })))
    }
  }, [courtPlayers, players])

  const addPlayer = (playerName) => {
    if (playerName.trim()) {
      // Check for duplicate names (case-insensitive)
      const nameExists = players.some(
        p => p.name.toLowerCase() === playerName.trim().toLowerCase()
      )

      if (nameExists) {
        alert(`A player named "${playerName}" already exists on the team!`)
        return
      }

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
        // Track when player was removed from court
        return { ...p, onCourt: false, lastRemovedTime: Date.now() }
      }
      return p
    }))
  }

  const removeFromCourt = (position) => {
    const player = courtPlayers[position]
    if (player) {
      setCourtPlayers({ ...courtPlayers, [position]: null })
      setPlayers(players.map(p =>
        p.id === player.id ? { ...p, onCourt: false, lastRemovedTime: Date.now() } : p
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
    const removalTime = Date.now()

    pendingSubstitutions.forEach(sub => {
      // Update court
      updatedCourt[sub.position] = sub.playerIn

      // Update player statuses
      const playerOutIndex = updatedPlayers.findIndex(p => p.id === sub.playerOut.id)
      const playerInIndex = updatedPlayers.findIndex(p => p.id === sub.playerIn.id)

      if (playerOutIndex !== -1) {
        updatedPlayers[playerOutIndex] = { ...updatedPlayers[playerOutIndex], onCourt: false, lastRemovedTime: removalTime }
      }
      if (playerInIndex !== -1) {
        updatedPlayers[playerInIndex] = { ...updatedPlayers[playerInIndex], onCourt: true }
      }
    })

    setCourtPlayers(updatedCourt)
    setPlayers(updatedPlayers)
    setPendingSubstitutions([])
  }

  // Sort bench players so most recently removed are at the bottom
  const benchPlayers = players
    .filter(p => !p.onCourt)
    .sort((a, b) => {
      // Players never on court (no lastRemovedTime) go first
      if (!a.lastRemovedTime && !b.lastRemovedTime) return 0
      if (!a.lastRemovedTime) return -1
      if (!b.lastRemovedTime) return 1
      // Otherwise sort by lastRemovedTime (oldest first, newest last)
      return a.lastRemovedTime - b.lastRemovedTime
    })

  return (
    <div className="app">
      <header className="app-header">
        <button className="menu-button" onClick={() => setIsModalOpen(true)}>
          ☰
        </button>
        <h1>🏀 Basketball Substitution Manager</h1>
      </header>

      <PlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPlayer={addPlayer}
      />

      <div className="app-content">
        <div className="left-panel">
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

      <footer className="app-footer">
        <p>Version {packageJson.version}</p>
      </footer>
    </div>
  )
}

export default App

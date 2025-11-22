import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Court from './components/Court';
import Bench from './components/Bench';
import SubstitutionManager from './components/SubstitutionManager';
import PlayerModal from './components/PlayerModal';
import GameControlModal from './components/GameControlModal';
import Menu from './components/Menu';
import * as Haptics from 'expo-haptics';

const POSITIONS = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];
const STORAGE_KEY = 'basketball-sub-data';
const VERSION = '1.4.0';

// Helper functions for AsyncStorage
const loadFromStorage = async () => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading from AsyncStorage:', error);
  }
  return null;
};

const saveToStorage = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to AsyncStorage:', error);
  }
};

function App() {
  // Get screen dimensions for responsive layout
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Load initial state from AsyncStorage
  const [players, setPlayers] = useState([]);
  const [courtPlayers, setCourtPlayers] = useState({
    'Point Guard': null,
    'Shooting Guard': null,
    'Small Forward': null,
    'Power Forward': null,
    'Center': null
  });
  const [pendingSubstitutions, setPendingSubstitutions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [isGameControlModalOpen, setIsGameControlModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('court'); // 'bench', 'court', 'subs'
  const [teamFoulsUs, setTeamFoulsUs] = useState(0);
  const [teamFoulsThem, setTeamFoulsThem] = useState(0);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const savedData = await loadFromStorage();
      if (savedData) {
        setPlayers(savedData.players || []);
        setCourtPlayers(savedData.courtPlayers || {
          'Point Guard': null,
          'Shooting Guard': null,
          'Small Forward': null,
          'Power Forward': null,
          'Center': null
        });
        setPendingSubstitutions(savedData.pendingSubstitutions || []);
        setGameActive(savedData.gameActive || false);
        setTeamFoulsUs(savedData.teamFoulsUs || 0);
        setTeamFoulsThem(savedData.teamFoulsThem || 0);
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);

  // Save to AsyncStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      saveToStorage({
        players,
        courtPlayers,
        pendingSubstitutions,
        gameActive,
        teamFoulsUs,
        teamFoulsThem
      });
    }
  }, [players, courtPlayers, pendingSubstitutions, gameActive, teamFoulsUs, teamFoulsThem, isLoaded]);

  // Reconcile player onCourt status with courtPlayers to ensure consistency
  useEffect(() => {
    const playersOnCourt = new Set(
      Object.values(courtPlayers)
        .filter(p => p !== null)
        .map(p => p.id)
    );

    const needsUpdate = players.some(p => {
      const shouldBeOnCourt = playersOnCourt.has(p.id);
      return p.onCourt !== shouldBeOnCourt;
    });

    if (needsUpdate) {
      setPlayers(players.map(p => ({
        ...p,
        onCourt: playersOnCourt.has(p.id)
      })));
    }
  }, [courtPlayers, players]);

  const addPlayer = (playerName) => {
    if (playerName.trim()) {
      const nameExists = players.some(
        p => p.name.toLowerCase() === playerName.trim().toLowerCase()
      );

      if (nameExists) {
        Alert.alert('Duplicate Player', `A player named "${playerName}" already exists on the team!`);
        return;
      }

      const newPlayer = {
        id: Date.now(),
        name: playerName,
        onCourt: false,
        totalTimeOnCourt: 0,
        currentStintTime: 0,
        timeOnCourtStart: null
      };
      setPlayers([...players, newPlayer]);
    }
  };

  const deletePlayer = (playerId) => {
    setPlayers(players.filter(p => p.id !== playerId));

    const updatedCourt = { ...courtPlayers };
    Object.keys(updatedCourt).forEach(position => {
      if (updatedCourt[position]?.id === playerId) {
        updatedCourt[position] = null;
      }
    });
    setCourtPlayers(updatedCourt);

    setPendingSubstitutions(pendingSubstitutions.filter(
      sub => sub.playerOut.id !== playerId && sub.playerIn.id !== playerId
    ));
  };

  const handleDrop = (position, player) => {
    const currentPlayerInPosition = courtPlayers[position];
    const isPlayerOnBench = !player.onCourt;

    if (currentPlayerInPosition && isPlayerOnBench) {
      addSubstitution(currentPlayerInPosition, player, position);
      return;
    }

    const updatedCourt = { ...courtPlayers };
    Object.keys(updatedCourt).forEach(pos => {
      if (updatedCourt[pos]?.id === player.id) {
        updatedCourt[pos] = null;
      }
    });

    updatedCourt[position] = player;
    setCourtPlayers(updatedCourt);

    const now = Date.now();
    setPlayers(players.map(p => {
      if (p.id === player.id) {
        return {
          ...p,
          onCourt: true,
          currentStintTime: 0,
          timeOnCourtStart: gameActive ? now : null
        };
      }
      if (currentPlayerInPosition && p.id === currentPlayerInPosition.id) {
        const stintTimeToAdd = (gameActive && p.timeOnCourtStart)
          ? (p.currentStintTime || 0) + (now - p.timeOnCourtStart)
          : (p.currentStintTime || 0);
        return {
          ...p,
          onCourt: false,
          lastRemovedTime: now,
          totalTimeOnCourt: (p.totalTimeOnCourt || 0) + stintTimeToAdd,
          currentStintTime: 0,
          timeOnCourtStart: null
        };
      }
      return p;
    }));
  };

  const removeFromCourt = (position) => {
    const player = courtPlayers[position];
    if (player) {
      const now = Date.now();
      setCourtPlayers({ ...courtPlayers, [position]: null });
      setPlayers(players.map(p => {
        if (p.id === player.id) {
          const stintTimeToAdd = (gameActive && p.timeOnCourtStart)
            ? (p.currentStintTime || 0) + (now - p.timeOnCourtStart)
            : (p.currentStintTime || 0);
          return {
            ...p,
            onCourt: false,
            lastRemovedTime: now,
            totalTimeOnCourt: (p.totalTimeOnCourt || 0) + stintTimeToAdd,
            currentStintTime: 0,
            timeOnCourtStart: null
          };
        }
        return p;
      }));
    }
  };

  const addSubstitution = (playerOut, playerIn, position) => {
    const newSub = {
      id: Date.now(),
      playerOut,
      playerIn,
      position
    };
    setPendingSubstitutions([...pendingSubstitutions, newSub]);
  };

  const removeSubstitution = (subId) => {
    setPendingSubstitutions(pendingSubstitutions.filter(sub => sub.id !== subId));
  };

  const executeSubstitutions = () => {
    const updatedCourt = { ...courtPlayers };
    const updatedPlayers = [...players];
    const now = Date.now();

    pendingSubstitutions.forEach(sub => {
      updatedCourt[sub.position] = sub.playerIn;

      const playerOutIndex = updatedPlayers.findIndex(p => p.id === sub.playerOut.id);
      const playerInIndex = updatedPlayers.findIndex(p => p.id === sub.playerIn.id);

      if (playerOutIndex !== -1) {
        const playerOut = updatedPlayers[playerOutIndex];
        const stintTimeToAdd = (gameActive && playerOut.timeOnCourtStart)
          ? (playerOut.currentStintTime || 0) + (now - playerOut.timeOnCourtStart)
          : (playerOut.currentStintTime || 0);
        updatedPlayers[playerOutIndex] = {
          ...playerOut,
          onCourt: false,
          lastRemovedTime: now,
          totalTimeOnCourt: (playerOut.totalTimeOnCourt || 0) + stintTimeToAdd,
          currentStintTime: 0,
          timeOnCourtStart: null
        };
      }
      if (playerInIndex !== -1) {
        updatedPlayers[playerInIndex] = {
          ...updatedPlayers[playerInIndex],
          onCourt: true,
          currentStintTime: 0,
          timeOnCourtStart: gameActive ? now : null
        };
      }
    });

    setCourtPlayers(updatedCourt);
    setPlayers(updatedPlayers);
    setPendingSubstitutions([]);
  };

  const benchPlayers = players
    .filter(p => !p.onCourt)
    .sort((a, b) => {
      const aTime = a.totalTimeOnCourt || 0;
      const bTime = b.totalTimeOnCourt || 0;
      return aTime - bTime;
    });

  const startGame = () => {
    const now = Date.now();
    setGameActive(true);
    setPlayers(players.map(p => {
      if (p.onCourt && !p.timeOnCourtStart) {
        return { ...p, timeOnCourtStart: now };
      }
      return p;
    }));
    setIsGameControlModalOpen(false);
  };

  const stopGame = () => {
    const now = Date.now();
    setGameActive(false);
    setPlayers(players.map(p => {
      if (p.onCourt && p.timeOnCourtStart) {
        const timeToAdd = now - p.timeOnCourtStart;
        return {
          ...p,
          currentStintTime: (p.currentStintTime || 0) + timeToAdd,
          timeOnCourtStart: null
        };
      }
      return p;
    }));
    setIsGameControlModalOpen(false);
  };

  const resetGameStats = () => {
    Alert.alert(
      'Reset Statistics',
      'Are you sure you want to reset all player time statistics? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setPlayers(players.map(p => ({
              ...p,
              totalTimeOnCourt: 0,
              currentStintTime: 0,
              timeOnCourtStart: p.onCourt && gameActive ? Date.now() : null
            })));
            setIsGameControlModalOpen(false);
          }
        }
      ]
    );
  };

  const toggleGame = () => {
    if (gameActive) {
      stopGame();
    } else {
      startGame();
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <Menu
            onAddPlayer={() => setIsModalOpen(true)}
            onGameControl={() => setIsGameControlModalOpen(true)}
          />
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {isTablet ? '🏀 Basketball Sub Manager' : '🏀 Sub Manager'}
            </Text>
            {/* Team Fouls */}
            <View style={styles.foulCounter}>
              <View style={styles.foulTeam}>
                <Text style={styles.foulLabel}>Us</Text>
                <View style={styles.foulControls}>
                  <TouchableOpacity
                    style={styles.foulButton}
                    onPress={() => {
                      if (teamFoulsUs > 0) {
                        setTeamFoulsUs(teamFoulsUs - 1);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                  >
                    <Text style={styles.foulButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.foulCount}>{teamFoulsUs}</Text>
                  <TouchableOpacity
                    style={styles.foulButton}
                    onPress={() => {
                      setTeamFoulsUs(teamFoulsUs + 1);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                  >
                    <Text style={styles.foulButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.foulTeam}>
                <Text style={styles.foulLabel}>Them</Text>
                <View style={styles.foulControls}>
                  <TouchableOpacity
                    style={styles.foulButton}
                    onPress={() => {
                      if (teamFoulsThem > 0) {
                        setTeamFoulsThem(teamFoulsThem - 1);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                  >
                    <Text style={styles.foulButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.foulCount}>{teamFoulsThem}</Text>
                  <TouchableOpacity
                    style={styles.foulButton}
                    onPress={() => {
                      setTeamFoulsThem(teamFoulsThem + 1);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                  >
                    <Text style={styles.foulButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.headerActions}>
            {pendingSubstitutions.length > 0 && (
              <TouchableOpacity
                style={styles.executeSubsButton}
                onPress={executeSubstitutions}
              >
                <Text style={styles.executeSubsText}>⚡ {pendingSubstitutions.length}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.gameToggleButton, gameActive ? styles.gameActive : styles.gamePaused]}
              onPress={toggleGame}
            >
              <Text style={styles.gameToggleText}>{gameActive ? '⏸' : '▶'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <PlayerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddPlayer={addPlayer}
        />

        <GameControlModal
          isOpen={isGameControlModalOpen}
          onClose={() => setIsGameControlModalOpen(false)}
          gameActive={gameActive}
          onStartGame={startGame}
          onStopGame={stopGame}
          onResetStats={resetGameStats}
        />

        {/* Main Content - Responsive Layout */}
        {isTablet ? (
          // iPad: Side-by-side three-panel layout
          <View style={styles.appContent}>
            <View style={styles.leftPanel}>
              <Bench
                players={benchPlayers}
                onDeletePlayer={deletePlayer}
              />
            </View>

            <View style={styles.centerPanel}>
              <Court
                courtPlayers={courtPlayers}
                positions={POSITIONS}
                onDrop={handleDrop}
                onRemoveFromCourt={removeFromCourt}
                onAddSubstitution={addSubstitution}
                benchPlayers={benchPlayers}
                gameActive={gameActive}
                players={players}
              />
            </View>

            <View style={styles.rightPanel}>
              <SubstitutionManager
                substitutions={pendingSubstitutions}
                onRemoveSubstitution={removeSubstitution}
                onExecuteSubstitutions={executeSubstitutions}
              />
            </View>
          </View>
        ) : (
          // iPhone: Single panel with tabs
          <>
            <View style={styles.mobileContent}>
              {activeTab === 'bench' && (
                <Bench
                  players={benchPlayers}
                  onDeletePlayer={deletePlayer}
                />
              )}
              {activeTab === 'court' && (
                <Court
                  courtPlayers={courtPlayers}
                  positions={POSITIONS}
                  onDrop={handleDrop}
                  onRemoveFromCourt={removeFromCourt}
                  onAddSubstitution={addSubstitution}
                  benchPlayers={benchPlayers}
                  gameActive={gameActive}
                  players={players}
                />
              )}
              {activeTab === 'subs' && (
                <SubstitutionManager
                  substitutions={pendingSubstitutions}
                  onRemoveSubstitution={removeSubstitution}
                  onExecuteSubstitutions={executeSubstitutions}
                />
              )}
            </View>

            {/* Tab Bar for iPhone */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'bench' && styles.activeTab]}
                onPress={() => {
                  setActiveTab('bench');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={[styles.tabIcon, activeTab === 'bench' && styles.activeTabIcon]}>👥</Text>
                <Text style={[styles.tabLabel, activeTab === 'bench' && styles.activeTabLabel]}>
                  Bench
                </Text>
                {benchPlayers.length > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{benchPlayers.length}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'court' && styles.activeTab]}
                onPress={() => {
                  setActiveTab('court');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={[styles.tabIcon, activeTab === 'court' && styles.activeTabIcon]}>🏀</Text>
                <Text style={[styles.tabLabel, activeTab === 'court' && styles.activeTabLabel]}>
                  Court
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'subs' && styles.activeTab]}
                onPress={() => {
                  setActiveTab('subs');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={[styles.tabIcon, activeTab === 'subs' && styles.activeTabIcon]}>⚡</Text>
                <Text style={[styles.tabLabel, activeTab === 'subs' && styles.activeTabLabel]}>
                  Subs
                </Text>
                {pendingSubstitutions.length > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{pendingSubstitutions.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Footer - Only show on iPad */}
        {isTablet && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>Version {VERSION}</Text>
          </View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 0 : 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: '#5568d3',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  foulCounter: {
    flexDirection: 'row',
    gap: 15,
  },
  foulTeam: {
    alignItems: 'center',
  },
  foulLabel: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 3,
    opacity: 0.9,
  },
  foulControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  foulButton: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foulButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  foulCount: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  executeSubsButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  executeSubsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gameToggleButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  gameActive: {
    backgroundColor: '#ff9800',
  },
  gamePaused: {
    backgroundColor: '#4caf50',
  },
  gameToggleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  leftPanel: {
    flex: 1,
    minWidth: 250,
  },
  centerPanel: {
    flex: 2,
  },
  rightPanel: {
    flex: 1,
    minWidth: 250,
  },
  footer: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
  // Mobile (iPhone) Layout Styles
  mobileContent: {
    flex: 1,
    padding: 10,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#667eea',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  activeTabIcon: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#667eea',
    fontWeight: '600',
  },
  tabBadge: {
    position: 'absolute',
    top: 4,
    right: '25%',
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default App;

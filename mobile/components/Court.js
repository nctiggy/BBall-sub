import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Map positions to their numbers
const POSITION_NUMBERS = {
  'Point Guard': 1,
  'Shooting Guard': 2,
  'Small Forward': 3,
  'Power Forward': 4,
  'Center': 5
};

// Format time in MM:SS
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

function Court({ courtPlayers, positions, onDrop, onRemoveFromCourt, onAddSubstitution, benchPlayers, gameActive, players }) {
  const [showSubMenu, setShowSubMenu] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second when game is active
  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameActive]);

  const handleSubstitution = (position, playerIn) => {
    const playerOut = courtPlayers[position];
    if (playerOut) {
      onAddSubstitution(playerOut, playerIn, position);
      setShowSubMenu(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleAddPlayer = (position, player) => {
    onDrop(position, player);
    setShowAddMenu(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleRemove = (position) => {
    onRemoveFromCourt(position);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.courtContainer}>
      <Text style={styles.title}>Basketball Court</Text>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.court}
        showsVerticalScrollIndicator={true}
      >
        {positions.map((position) => {
          const player = courtPlayers[position];
          const fullPlayer = player ? players.find(p => p.id === player.id) : null;

          let currentStintTime = 0;
          let totalPlayTime = 0;
          if (fullPlayer) {
            currentStintTime = fullPlayer.currentStintTime || 0;
            if (gameActive && fullPlayer.timeOnCourtStart) {
              currentStintTime += (currentTime - fullPlayer.timeOnCourtStart);
            }
            totalPlayTime = (fullPlayer.totalTimeOnCourt || 0) + currentStintTime;
          }

          return (
            <View key={position} style={[styles.courtPosition, player && styles.occupied]}>
              <View style={styles.positionLabel}>
                <View style={styles.positionNumber}>
                  <Text style={styles.positionNumberText}>{POSITION_NUMBERS[position]}</Text>
                </View>
                <Text style={styles.positionLabelText}>{position}</Text>
              </View>

              {player ? (
                <View style={styles.playerOnCourt}>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    {fullPlayer && currentStintTime > 0 && (
                      <View style={styles.playerTimeContainer}>
                        <Text style={styles.playerTime}>
                          {formatTime(currentStintTime)} / {formatTime(totalPlayTime)}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.playerActions}>
                    <TouchableOpacity
                      style={styles.subButton}
                      onPress={() => setShowSubMenu(showSubMenu === position ? null : position)}
                    >
                      <Text style={styles.subButtonText}>Sub</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemove(position)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>

                  {showSubMenu === position && benchPlayers.length > 0 && (
                    <View style={styles.subMenu}>
                      <View style={styles.subMenuHeader}>
                        <Text style={styles.subMenuHeaderText}>Substitute with:</Text>
                      </View>
                      <ScrollView style={styles.subMenuScroll} nestedScrollEnabled={true}>
                        {benchPlayers.map((benchPlayer) => (
                          <TouchableOpacity
                            key={benchPlayer.id}
                            style={styles.subMenuItem}
                            onPress={() => handleSubstitution(position, benchPlayer)}
                          >
                            <Text style={styles.subMenuItemText}>{benchPlayer.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.emptyPosition}
                    onPress={() => setShowAddMenu(showAddMenu === position ? null : position)}
                  >
                    <Text style={styles.emptyPositionText}>
                      {benchPlayers.length > 0 ? 'Tap to add player' : 'No players available'}
                    </Text>
                  </TouchableOpacity>

                  {showAddMenu === position && benchPlayers.length > 0 && (
                    <View style={styles.addMenu}>
                      <View style={styles.addMenuHeader}>
                        <Text style={styles.addMenuHeaderText}>Select player:</Text>
                      </View>
                      <ScrollView style={styles.addMenuScroll} nestedScrollEnabled={true}>
                        {benchPlayers.map((benchPlayer) => (
                          <TouchableOpacity
                            key={benchPlayer.id}
                            style={styles.addMenuItem}
                            onPress={() => handleAddPlayer(position, benchPlayer)}
                          >
                            <Text style={styles.addMenuItemText}>{benchPlayer.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  courtContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  scrollView: {
    flex: 1,
  },
  court: {
    padding: 15,
    gap: 15,
  },
  courtPosition: {
    backgroundColor: 'white',
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 15,
    minHeight: 150,
  },
  occupied: {
    borderStyle: 'solid',
    borderColor: '#4caf50',
    backgroundColor: '#e8f5e9',
  },
  positionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  positionNumber: {
    width: 28,
    height: 28,
    backgroundColor: '#667eea',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  positionLabelText: {
    fontWeight: '600',
    color: '#666',
    fontSize: 14,
  },
  emptyPosition: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPositionText: {
    color: '#999',
    fontStyle: 'italic',
  },
  playerOnCourt: {
    flex: 1,
  },
  playerInfo: {
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  playerTimeContainer: {
    backgroundColor: '#667eea',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  playerTime: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
  },
  playerActions: {
    flexDirection: 'row',
    gap: 5,
  },
  subButton: {
    flex: 1,
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  subButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subMenu: {
    marginTop: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2196f3',
    borderRadius: 8,
    maxHeight: 200,
    overflow: 'hidden',
  },
  subMenuHeader: {
    backgroundColor: '#2196f3',
    padding: 10,
  },
  subMenuHeaderText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  subMenuScroll: {
    maxHeight: 150,
  },
  subMenuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  subMenuItemText: {
    fontSize: 16,
    color: '#333',
  },
  addMenu: {
    marginTop: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4caf50',
    borderRadius: 8,
    maxHeight: 200,
    overflow: 'hidden',
  },
  addMenuHeader: {
    backgroundColor: '#4caf50',
    padding: 10,
  },
  addMenuHeaderText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  addMenuScroll: {
    maxHeight: 150,
  },
  addMenuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addMenuItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Court;

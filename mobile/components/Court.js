import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import * Haptics from 'expo-haptics';

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

function Court({ courtPlayers, positions, onDrop, onRemoveFromCourt, onAddSubstitution, benchPlayers, gameActive, players, selectedPlayer, onPlayerTap, onPositionTap }) {
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

  const handleRemove = (position) => {
    onRemoveFromCourt(position);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.courtContainer}>
      <Text style={styles.title}>
        Basketball Court
        {selectedPlayer && selectedPlayer.onCourt && (
          <Text style={styles.titleHint}> - Tap position to swap</Text>
        )}
        {selectedPlayer && !selectedPlayer.onCourt && (
          <Text style={styles.titleHint}> - Tap position to place</Text>
        )}
      </Text>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.court}
        showsVerticalScrollIndicator={true}
      >
        {positions.map((position) => {
          const player = courtPlayers[position];
          const fullPlayer = player ? players.find(p => p.id === player.id) : null;
          const isPlayerSelected = selectedPlayer && fullPlayer && selectedPlayer.id === fullPlayer.id;

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
            <TouchableOpacity
              key={position}
              style={[
                styles.courtPosition,
                player && styles.occupied,
                isPlayerSelected && styles.positionSelected
              ]}
              onPress={() => {
                if (player) {
                  // If there's a player here, select them
                  onPlayerTap(fullPlayer);
                } else if (selectedPlayer) {
                  // If position is empty and we have a selected player, place them here
                  onPositionTap(position);
                }
              }}
              activeOpacity={0.7}
            >
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

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleRemove(position);
                    }}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.emptyPosition}>
                  <Text style={styles.emptyPositionText}>
                    {selectedPlayer ? 'Tap to place here' : 'Empty'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
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
  titleHint: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#667eea',
    fontStyle: 'italic',
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
  positionSelected: {
    borderColor: '#667eea',
    borderWidth: 4,
    backgroundColor: '#f0f4ff',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
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
});

export default Court;

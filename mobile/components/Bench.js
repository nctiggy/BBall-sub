import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

// Format time in MM:SS
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

function Bench({ players, onDeletePlayer }) {
  const handleDeleteClick = (player) => {
    Alert.alert(
      'Delete Player',
      `Are you sure you want to delete ${player.name} from the team?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDeletePlayer(player.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.bench}>
      <Text style={styles.title}>Bench ({players.length})</Text>
      <ScrollView
        style={styles.benchPlayers}
        contentContainerStyle={styles.benchPlayersContent}
        showsVerticalScrollIndicator={true}
      >
        {players.length === 0 ? (
          <View style={styles.emptyBench}>
            <Text style={styles.emptyBenchText}>No players on bench</Text>
            <Text style={styles.emptyBenchHint}>Add players above or remove them from the court</Text>
          </View>
        ) : (
          players.map((player) => (
            <View key={player.id} style={styles.benchPlayer}>
              <View style={styles.playerAvatar}>
                <Text style={styles.playerAvatarText}>
                  {player.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.playerDetails}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerTotalTime}>
                  Total: {formatTime(player.totalTimeOnCourt || 0)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deletePlayer}
                onPress={() => handleDeleteClick(player)}
              >
                <Text style={styles.deletePlayerText}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bench: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  benchPlayers: {
    flex: 1,
  },
  benchPlayersContent: {
    padding: 10,
    gap: 10,
  },
  emptyBench: {
    padding: 30,
    alignItems: 'center',
  },
  emptyBenchText: {
    color: '#999',
    fontSize: 16,
    marginBottom: 5,
  },
  emptyBenchHint: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
  },
  benchPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#667eea',
    borderRadius: 8,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  playerDetails: {
    flex: 1,
    gap: 4,
  },
  playerName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  playerTotalTime: {
    color: 'white',
    fontSize: 13,
    opacity: 0.9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 0.5,
  },
  deletePlayer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletePlayerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Bench;

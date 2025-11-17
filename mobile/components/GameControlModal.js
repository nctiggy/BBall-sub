import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';

function GameControlModal({ isOpen, onClose, gameActive, onStartGame, onStopGame, onResetStats }) {
  const handleStart = () => {
    onStartGame();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleStop = () => {
    onStopGame();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleReset = () => {
    onResetStats();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <Text style={styles.modalTitle}>Game Control</Text>

          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Game Status:</Text>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, gameActive && styles.statusDotActive]} />
                <Text style={[styles.statusText, gameActive && styles.statusTextActive]}>
                  {gameActive ? 'Active' : 'Paused'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonGroup}>
            {!gameActive ? (
              <TouchableOpacity
                style={[styles.button, styles.startButton]}
                onPress={handleStart}
              >
                <Text style={styles.buttonText}>▶ Start Game</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.stopButton]}
                onPress={handleStop}
              >
                <Text style={styles.buttonText}>⏸ Stop Game</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>🔄 Reset Statistics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#999',
  },
  statusDotActive: {
    backgroundColor: '#4caf50',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  statusTextActive: {
    color: '#4caf50',
  },
  buttonGroup: {
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4caf50',
  },
  stopButton: {
    backgroundColor: '#ff9800',
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  closeButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default GameControlModal;

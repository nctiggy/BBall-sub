import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

function Menu({ onAddPlayer, onGameControl }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddPlayer = () => {
    setIsOpen(false);
    onAddPlayer();
  };

  const handleGameControl = () => {
    setIsOpen(false);
    onGameControl();
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.menuButtonText}>☰</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.menuDropdown}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleAddPlayer}
            >
              <Text style={styles.menuItemText}>➕ Add Player</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleGameControl}
            >
              <Text style={styles.menuItemText}>⚙️ Game Control</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingLeft: 10,
  },
  menuDropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Menu;

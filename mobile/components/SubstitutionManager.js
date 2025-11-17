import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';

function SubstitutionManager({ substitutions, onRemoveSubstitution, onExecuteSubstitutions }) {
  const handleRemove = (subId) => {
    onRemoveSubstitution(subId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleExecute = () => {
    onExecuteSubstitutions();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Substitutions</Text>
      <ScrollView
        style={styles.subsList}
        contentContainerStyle={styles.subsListContent}
        showsVerticalScrollIndicator={true}
      >
        {substitutions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No pending substitutions</Text>
            <Text style={styles.emptyStateHint}>
              Drag bench players to occupied court positions or use the Sub button
            </Text>
          </View>
        ) : (
          <>
            {substitutions.map((sub, index) => (
              <View key={sub.id} style={styles.subItem}>
                <View style={styles.subContent}>
                  <View style={styles.subHeader}>
                    <Text style={styles.subNumber}>#{index + 1}</Text>
                    <Text style={styles.subPosition}>{sub.position}</Text>
                  </View>
                  <View style={styles.subDetails}>
                    <View style={styles.playerChange}>
                      <Text style={styles.playerOut}>{sub.playerOut.name}</Text>
                      <Text style={styles.arrow}>→</Text>
                      <Text style={styles.playerIn}>{sub.playerIn.name}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(sub.id)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.executeButton}
              onPress={handleExecute}
            >
              <Text style={styles.executeButtonText}>
                ⚡ Execute All Substitutions ({substitutions.length})
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  subsList: {
    flex: 1,
  },
  subsListContent: {
    padding: 10,
    gap: 10,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#999',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  emptyStateHint: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  subItem: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
    gap: 10,
  },
  subContent: {
    flex: 1,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  subNumber: {
    backgroundColor: '#2196f3',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  subPosition: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  subDetails: {
    gap: 5,
  },
  playerChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerOut: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 14,
    color: '#666',
  },
  playerIn: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '500',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#f44336',
    fontSize: 24,
    fontWeight: 'bold',
  },
  executeButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  executeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SubstitutionManager;

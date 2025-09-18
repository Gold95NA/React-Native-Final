import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { clearSavedPlaces } from '../services/storage';

export default function SettingsModal() {
  const onClearSaved = async () => {
    await clearSavedPlaces();
    Alert.alert('Saved places cleared');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Data</Text>
        <Pressable onPress={onClearSaved} style={styles.button}>
          <Text style={styles.buttonText}>Clear Saved Places</Text>
        </Pressable>
        <Text style={styles.help}>
          This removes all items from the Saved tab on this device.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },

  section: { marginTop: 4 },
  label: { fontSize: 16, fontWeight: '700', marginBottom: 8 },

  button: { backgroundColor: '#111', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },

  help: { color: '#666', fontSize: 12, marginTop: 8 },
});

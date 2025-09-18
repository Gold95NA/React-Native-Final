import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SettingsModal() {
  const [unit, setUnit] = useState<'C' | 'F'>('F');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Temperature unit</Text>
        <View style={styles.btnRow}>
          <Pressable onPress={() => setUnit('F')} style={[styles.btn, unit === 'F' && styles.btnActive]}><Text style={[styles.btnText, unit === 'F' && styles.btnTextActive]}>°F</Text></Pressable>
          <Pressable onPress={() => setUnit('C')} style={[styles.btn, unit === 'C' && styles.btnActive]}><Text style={[styles.btnText, unit === 'C' && styles.btnTextActive]}>°C</Text></Pressable>
        </View>
      </View>

      <Text style={styles.note}>Modal demonstrates a global route outside the tab stacks.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  row: { marginBottom: 12 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  btnRow: { flexDirection: 'row', gap: 10 },
  btn: { backgroundColor: '#eee', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  btnActive: { backgroundColor: '#111' },
  btnText: { color: '#111', fontWeight: '700' },
  btnTextActive: { color: '#fff' },
  note: { marginTop: 20, color: '#666' }
});

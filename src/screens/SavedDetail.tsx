import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SavedStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<SavedStackParamList, 'SavedDetail'>;

export default function SavedDetail({ route }: Props) {
  const { name } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text>Details coming soon…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 8 }
});
import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlacesStackParamList } from '../types/navigation';
import { isPlaceSaved, removePlace, savePlace } from '../services/storage';

type Props = NativeStackScreenProps<PlacesStackParamList, 'PlaceDetail'>;

export default function PlaceDetail({ route }: Props) {
  const { id, name, lat, lon, address } = route.params;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => setSaved(await isPlaceSaved(id)))();
  }, [id]);

  const toggleSave = async () => {
    try {
      if (saved) {
        await removePlace(id);
        setSaved(false);
      } else {
        await savePlace({ id, name, lat, lon, address });
        setSaved(true);
      }
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
  };

  const openMaps = () => {
    const label = encodeURIComponent(name);
    const url = `http://maps.apple.com/?ll=${lat},${lon}&q=${label}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      {address ? <Text style={styles.addr}>{address}</Text> : null}
      <Text style={styles.coords}>Lat: {lat.toFixed(5)}  Lon: {lon.toFixed(5)}</Text>

      <Pressable onPress={openMaps} style={styles.btn}>
        <Text style={styles.btnText}>Open in Maps</Text>
      </Pressable>

      <Pressable onPress={toggleSave} style={[styles.btn, saved ? styles.btnSaved : null]}>
        <Text style={[styles.btnText, saved ? styles.btnTextSaved : null]}>
          {saved ? 'Remove from Saved' : 'Save Place'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
  addr: { fontSize: 14, color: '#555', marginBottom: 10 },
  coords: { fontSize: 12, color: '#666', marginBottom: 16 },
  btn: { marginTop: 10, backgroundColor: '#111', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  btnSaved: { backgroundColor: '#eaeaea' },
  btnText: { color: '#fff', fontWeight: '700' },
  btnTextSaved: { color: '#111' }
});
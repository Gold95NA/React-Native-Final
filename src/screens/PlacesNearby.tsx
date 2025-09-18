import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlacesStackParamList } from '../types/navigation';
import { useLocation } from '../hooks/useLocation';
import { fetchNearbyCafes, Place } from '../services/places';
import { searchCity } from '../services/geocoding';

type Props = NativeStackScreenProps<PlacesStackParamList, 'PlacesNearby'>;

export default function PlacesNearby({ navigation }: Props) {
  const { coords, status } = useLocation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const scale = useMemo(() => new Animated.Value(1), []);
  const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();

  useEffect(() => {
    if (!coords || status !== 'granted') return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchNearbyCafes(coords.lat, coords.lon);
        setPlaces(res);
      } finally {
        setLoading(false);
      }
    })();
  }, [coords, status]);

  const onSearchCity = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const results = await searchCity(query.trim());
      if (results[0]) {
        const p = await fetchNearbyCafes(results[0].lat, results[0].lon);
        setPlaces(p);
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === 'requesting' || loading) return <ActivityIndicator style={styles.center} />;
  if (status === 'denied') return (
    <View style={styles.container}>
      <Text style={styles.title}>Search cafes by city</Text>
      <View style={styles.searchRow}>
        <TextInput style={styles.input} placeholder="City, State" value={query} onChangeText={setQuery} />
        <Pressable style={styles.searchBtn} onPress={onSearchCity}><Text style={styles.searchText}>Search</Text></Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cafes Nearby</Text>

      <View style={styles.searchRow}>
        <TextInput style={styles.input} placeholder="Or search any city" value={query} onChangeText={setQuery} />
        <Pressable style={styles.searchBtn} onPress={onSearchCity}><Text style={styles.searchText}>Search</Text></Pressable>
      </View>

      <FlatList
        data={places}
        keyExtractor={(p) => p.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => navigation.navigate('PlaceDetail', { id: item.id, name: item.name, lat: item.lat, lon: item.lon, address: item.address })}
            style={styles.card}
          >
            <Animated.View style={{ transform: [{ scale }] }}>
              <Text style={styles.placeName} numberOfLines={1}>{item.name}</Text>
              {item.address ? <Text style={styles.addr} numberOfLines={1}>{item.address}</Text> : null}
              <Text style={styles.coords}>{item.lat.toFixed(4)}, {item.lon.toFixed(4)}</Text>
            </Animated.View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.msg}>No places found yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 12, height: 40, backgroundColor: '#fff' },
  searchBtn: { backgroundColor: '#111', borderRadius: 10, paddingHorizontal: 14, justifyContent: 'center' },
  searchText: { color: '#fff', fontWeight: '700' },
  card: { padding: 14, borderRadius: 12, backgroundColor: '#f3f3f3' },
  placeName: { fontSize: 16, fontWeight: '700' },
  addr: { fontSize: 12, color: '#666', marginTop: 2 },
  coords: { fontSize: 12, color: '#555', marginTop: 6 },
  msg: { color: '#666' }
});
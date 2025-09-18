import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getSavedPlaces, SavedPlace } from '../services/storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function SavedList() {
  const [items, setItems] = useState<SavedPlace[] | null>(null);
  const nav = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      (async () => setItems(await getSavedPlaces()))();
    }, [])
  );

  if (!items) return <ActivityIndicator style={styles.center} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved</Text>

      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              nav.navigate('PlacesStack', {
                screen: 'PlaceDetail',
                params: { id: item.id, name: item.name, lat: item.lat, lon: item.lon, address: item.address }
              })
            }
          >
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            {item.address ? <Text style={styles.addr} numberOfLines={1}>{item.address}</Text> : null}
            <Text style={styles.coords}>{item.lat.toFixed(4)}, {item.lon.toFixed(4)}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.msg}>Nothing saved yet. Open a place and tap “Save Place”.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  card: { padding: 14, borderRadius: 12, backgroundColor: '#f3f3f3' },
  name: { fontSize: 16, fontWeight: '700' },
  addr: { fontSize: 12, color: '#666', marginTop: 2 },
  coords: { fontSize: 12, color: '#555', marginTop: 6 },
  msg: { color: '#666' }
});
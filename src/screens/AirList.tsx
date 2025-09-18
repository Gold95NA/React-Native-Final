import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLocation } from '../hooks/useLocation';
import { AirStackParamList } from '../types/navigation';
import { fetchAir, AirPoint } from '../services/air';
import { reverseGeocode } from '../services/geocoding';

type Props = NativeStackScreenProps<AirStackParamList, 'AirList'>;

export default function AirList({ navigation }: Props) {
  const { coords, status, error } = useLocation();
  const [city, setCity] = useState<string>('Your Area');
  const [data, setData] = useState<AirPoint[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!coords || status !== 'granted') return;
    (async () => {
      setLoading(true);
      try {
        const [air, rev] = await Promise.all([fetchAir(coords.lat, coords.lon), reverseGeocode(coords.lat, coords.lon)]);
        setData(air.points);
        setCity(rev.displayName || air.cityName);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, [coords, status]);

  const scale = useMemo(() => new Animated.Value(1), []);
  const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();

  if (status === 'requesting' || loading) return <ActivityIndicator style={styles.center} />;
  if (status === 'denied') return <View style={styles.center}><Text style={styles.msg}>Location denied. Use Places tab to search.</Text></View>;
  if (status === 'error') return <View style={styles.center}><Text style={styles.msg}>{error ?? 'Error'}</Text></View>;
  if (!coords) return <View style={styles.center}><Text style={styles.msg}>Getting location…</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={2}>{city}</Text>
      <Text style={styles.subtitle}>Latest air quality readings nearby</Text>

      <FlatList
        data={data}
        keyExtractor={(item, idx) => `${item.parameter}-${idx}`}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => navigation.navigate('AirDetail', { city, lat: coords.lat, lon: coords.lon })}
            style={styles.card}
          >
            <Animated.View style={{ transform: [{ scale }] }}>
              <Text style={styles.param}>{labelFor(item.parameter)}</Text>
              <Text style={styles.value}>
                {Math.round(item.value)}
                {item.unit ? ` ${item.unit}` : ''}
              </Text>

              {(item.parameter === 'aqi' || item.parameter === 'us_aqi') ? (
                <Text style={styles.aqi}>AQI: {aqiLabel(item.value)}</Text>
              ) : null}

              <Text style={styles.time}>{new Date(item.time).toLocaleString()}</Text>
            </Animated.View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.msg}>No readings found.</Text>}
      />
    </View>
  );
}

const labelFor = (p: string) =>
  p === 'aqi' ? 'AQI'
  : p === 'us_aqi' ? 'US AQI'
  : p === 'pm2_5' ? 'PM2.5'
  : p.toUpperCase();

const aqiLabel = (v: number) => {
  const n = Math.round(v);
  if (n <= 1) return 'Good (1)';
  if (n === 2) return 'Fair (2)';
  if (n === 3) return 'Moderate (3)';
  if (n === 4) return 'Poor (4)';
  return 'Very Poor (5)';
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 12 },
  card: { padding: 16, borderRadius: 12, backgroundColor: '#f3f3f3' },
  param: { fontSize: 12, color: '#555', fontWeight: '700' },
  value: { fontSize: 24, fontWeight: '800', marginTop: 4 },
  aqi: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  time: { fontSize: 12, color: '#666', marginTop: 6 },
  msg: { color: '#666' }
});
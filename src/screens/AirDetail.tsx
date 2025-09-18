import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AirStackParamList } from '../types/navigation';
import { fetchAir, AirPoint } from '../services/air';

type Props = NativeStackScreenProps<AirStackParamList, 'AirDetail'>;

export default function AirDetail({ route }: Props) {
  const { city, lat, lon } = route.params;
  const [data, setData] = useState<AirPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const air = await fetchAir(lat, lon);
        setData(air.points);
      } finally {
        setLoading(false);
      }
    })();
  }, [lat, lon]);

  if (loading) return <ActivityIndicator style={styles.center} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{city}</Text>
      <FlatList
        data={data}
        keyExtractor={(item, idx) => `${item.parameter}-${idx}`}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.param}>{labelFor(item.parameter)}</Text>
            <Text style={styles.value}>
              {Math.round(item.value)}
              {item.unit ? ` ${item.unit}` : ''}
            </Text>
            {(item.parameter === 'aqi' || item.parameter === 'us_aqi') ? (
              <Text style={styles.aqi}>AQI: {aqiLabel(item.value)}</Text>
            ) : null}
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
  title: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
  row: { backgroundColor: '#f3f3f3', borderRadius: 12, padding: 12 },
  param: { fontSize: 12, color: '#555', fontWeight: '700' },
  value: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  aqi: { fontSize: 12, fontWeight: '700', marginTop: 2 }
});
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SavedPlace = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
};

const KEY = 'saved_places_v1';

export async function getSavedPlaces(): Promise<SavedPlace[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as SavedPlace[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function savePlace(p: SavedPlace): Promise<void> {
  const items = await getSavedPlaces();
  const exists = items.some((x) => x.id === p.id);
  if (!exists) {
    items.push(p);
    await AsyncStorage.setItem(KEY, JSON.stringify(items));
  }
}

export async function removePlace(id: string): Promise<void> {
  const items = await getSavedPlaces();
  const next = items.filter((x) => x.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function isPlaceSaved(id: string): Promise<boolean> {
  const items = await getSavedPlaces();
  return items.some((x) => x.id === id);
}

export async function clearSavedPlaces(): Promise<void> {
  await AsyncStorage.removeItem('saved_places_v1');
}
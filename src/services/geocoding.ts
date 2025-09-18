export type RevGeo = { displayName: string };

export async function reverseGeocode(lat: number, lon: number): Promise<RevGeo> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Reverse geocode ${res.status}`);
  const json = await res.json();
  return { displayName: json.display_name ?? 'Current location' };
}

export type SearchResult = { name: string; lat: number; lon: number };

export async function searchCity(query: string): Promise<SearchResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=5`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Search ${res.status}`);
  const json = await res.json();
  return (json as any[]).map((it) => ({
    name: it.display_name as string,
    lat: parseFloat(it.lat),
    lon: parseFloat(it.lon),
  }));
}
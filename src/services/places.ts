export type Place = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
};

export async function fetchNearbyCafes(lat: number, lon: number): Promise<Place[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="cafe"](around:4000,${lat},${lon});
      way["amenity"="cafe"](around:4000,${lat},${lon});
      relation["amenity"="cafe"](around:4000,${lat},${lon});
      node["shop"="coffee"](around:4000,${lat},${lon});
      way["shop"="coffee"](around:4000,${lat},${lon});
      relation["shop"="coffee"](around:4000,${lat},${lon});
    );
    out center 50;
  `.trim();

  const body = `data=${encodeURIComponent(query)}`;

  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter'
  ];

  let elements: any[] | null = null;
  let lastErr: unknown = null;

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body
      });
      if (!res.ok) throw new Error(`Overpass ${res.status}`);
      const json = await res.json();
      elements = json.elements as any[];
      if (elements && elements.length) break;
    } catch (e) {
      lastErr = e;
    }
  }

  if (!elements) {
    throw lastErr ?? new Error('No places data');
  }

  return elements.slice(0, 50).map((el) => {
    const center = el.center ?? { lat: el.lat, lon: el.lon };
    const name = el.tags?.name ?? (el.tags?.brand ? `${el.tags.brand} (Coffee)` : 'Coffee');
    const address = el.tags?.['addr:street']
      ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] ?? ''}`.trim()
      : undefined;

    return {
      id: String(el.id),
      name,
      lat: center.lat,
      lon: center.lon,
      address,
    } as Place;
  });
}
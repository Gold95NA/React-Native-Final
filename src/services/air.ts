import Constants from "expo-constants";

export type AirPoint = {
  time: string;         
  parameter: string;    
  value: number;
  unit: string;         
};

export type AirSummary = {
  cityName: string;     
  points: AirPoint[];
};

const API_KEY = (Constants.expoConfig?.extra as any)?.OPENWEATHER_API_KEY as string;

export async function fetchAir(lat: number, lon: number): Promise<AirSummary> {
  if (!API_KEY) throw new Error("Missing OPENWEATHER_API_KEY");
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`OpenWeather AQ ${res.status}`);
  const json = await res.json();

  const item = json?.list?.[0];
  if (!item) return { cityName: "This area", points: [] };

  const dt = item.dt ? new Date(item.dt * 1000).toISOString() : new Date().toISOString();
  const aqiIndex = item.main?.aqi as number | undefined; // 1..5

  const c = item.components || {};

  const points: AirPoint[] = [];
  if (typeof aqiIndex === "number")
    points.push({ time: dt, parameter: "aqi", value: aqiIndex, unit: "index" });

  const push = (k: string, v: number | undefined) => {
    if (typeof v === "number") points.push({ time: dt, parameter: k, value: v, unit: "µg/m³" });
  };

  push("pm2_5", c.pm2_5);
  push("pm10",  c.pm10);
  push("o3",    c.o3);
  push("no2",   c.no2);
  push("so2",   c.so2);
  push("co",    c.co);
  push("nh3",   c.nh3);

  return { cityName: "This area", points };
}
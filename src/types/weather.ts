export interface WeatherData {
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure: number;
  wind_direction: number;
  wind_speed: number;
  solar_radiation: number;
  uv_index: number;
  rain: number;
  pm1: number;
  pm2_5: number;
  lat?: number;
  lon?: number;
}

export interface Station {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  coordinates: [number, number];
  latestData: WeatherData | null;
  timeSeries: WeatherData[];
}

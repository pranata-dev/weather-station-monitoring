// Station and weather data type definitions

export interface TimeSeriesPoint {
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  uvIndex: number;
  rainfall: number;
}

export interface Station {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  macAddress: string;
  status: "online" | "offline";
  registeredAt: string;
  lastSeen: string;
  current: {
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    uvIndex: number;
    rainfall: number;
  };
  timeSeries: TimeSeriesPoint[];
}

export interface AccessRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  stationId: string;
  stationName: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
}

// Generate time-series data for the past 24 hours at 5-minute intervals (288 points)
function generateTimeSeries(
  baseTemp: number,
  baseHumidity: number,
  basePressure: number,
  baseWindSpeed: number,
  baseUvIndex: number,
  baseRainfall: number
): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  for (let i = 0; i < 288; i++) {
    const timestamp = new Date(
      twentyFourHoursAgo.getTime() + i * 5 * 60 * 1000
    );

    // Simulate diurnal temperature variation (cooler at night, warmer midday)
    const hourOfDay = timestamp.getHours() + timestamp.getMinutes() / 60;
    const diurnalFactor = Math.sin(((hourOfDay - 6) / 24) * 2 * Math.PI);
    const tempVariation = diurnalFactor * 4;

    // Add realistic noise
    const noise = () => (Math.random() - 0.5) * 0.6;

    const temperature = parseFloat(
      (baseTemp + tempVariation + noise()).toFixed(1)
    );
    const humidity = parseFloat(
      Math.min(
        100,
        Math.max(20, baseHumidity - tempVariation * 3 + noise() * 5)
      ).toFixed(1)
    );
    const pressure = parseFloat(
      (basePressure + Math.sin(i / 50) * 2 + noise()).toFixed(1)
    );
    const windSpeed = parseFloat(
      Math.max(0, baseWindSpeed + Math.sin(i / 30) * 3 + noise() * 2).toFixed(1)
    );
    const uvIndex = parseFloat(
      Math.max(
        0,
        hourOfDay >= 6 && hourOfDay <= 18
          ? baseUvIndex * Math.sin(((hourOfDay - 6) / 12) * Math.PI) +
              noise() * 0.5
          : 0
      ).toFixed(1)
    );
    const rainfall = parseFloat(
      Math.max(
        0,
        baseRainfall > 0 && Math.random() > 0.7
          ? baseRainfall * Math.random() * 2
          : 0
      ).toFixed(1)
    );

    points.push({
      timestamp: timestamp.toISOString(),
      temperature,
      humidity,
      pressure,
      windSpeed,
      uvIndex,
      rainfall,
    });
  }

  return points;
}

// Mock weather stations with Indonesian locations
export const stations: Station[] = [
  {
    id: "WS-JAKARTA-001",
    name: "Jakarta Central Observatory",
    location: "Jakarta, Indonesia",
    coordinates: [-6.2088, 106.8456],
    macAddress: "A4:CF:12:8B:3E:01",
    status: "online",
    registeredAt: "2025-03-15T08:00:00Z",
    lastSeen: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    current: {
      temperature: 31.2,
      humidity: 72.5,
      pressure: 1010.3,
      windSpeed: 8.4,
      uvIndex: 7.2,
      rainfall: 0.0,
    },
    timeSeries: generateTimeSeries(30, 75, 1010, 7, 8, 0.2),
  },
  {
    id: "WS-BANDUNG-002",
    name: "Bandung Highland Station",
    location: "Bandung, Indonesia",
    coordinates: [-6.9175, 107.6191],
    macAddress: "A4:CF:12:8B:3E:02",
    status: "online",
    registeredAt: "2025-04-01T10:30:00Z",
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    current: {
      temperature: 22.8,
      humidity: 68.1,
      pressure: 920.7,
      windSpeed: 5.2,
      uvIndex: 6.1,
      rainfall: 1.5,
    },
    timeSeries: generateTimeSeries(22, 70, 920, 5, 6, 1.0),
  },
  {
    id: "WS-SURABAYA-003",
    name: "Surabaya Coastal Monitor",
    location: "Surabaya, Indonesia",
    coordinates: [-7.2575, 112.7521],
    macAddress: "A4:CF:12:8B:3E:03",
    status: "offline",
    registeredAt: "2025-05-10T14:15:00Z",
    lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    current: {
      temperature: 33.5,
      humidity: 80.3,
      pressure: 1008.1,
      windSpeed: 12.1,
      uvIndex: 9.0,
      rainfall: 0.0,
    },
    timeSeries: generateTimeSeries(32, 82, 1008, 11, 9, 0),
  },
];

// Mock access requests for the management dashboard
export const accessRequests: AccessRequest[] = [
  {
    id: "REQ-001",
    userId: "USR-042",
    userName: "Dr. Rina Kusuma",
    userEmail: "rina.kusuma@university.ac.id",
    stationId: "WS-JAKARTA-001",
    stationName: "Jakarta Central Observatory",
    requestedAt: "2026-05-14T09:20:00Z",
    status: "pending",
  },
  {
    id: "REQ-002",
    userId: "USR-078",
    userName: "Budi Santoso",
    userEmail: "b.santoso@meteo.co.id",
    stationId: "WS-BANDUNG-002",
    stationName: "Bandung Highland Station",
    requestedAt: "2026-05-13T16:45:00Z",
    status: "pending",
  },
  {
    id: "REQ-003",
    userId: "USR-115",
    userName: "Ayu Lestari",
    userEmail: "ayu.l@research.org",
    stationId: "WS-JAKARTA-001",
    stationName: "Jakarta Central Observatory",
    requestedAt: "2026-05-12T11:30:00Z",
    status: "pending",
  },
];

// Helper functions
export function getStationById(id: string): Station | undefined {
  return stations.find((s) => s.id === id);
}

export function getOnlineStations(): Station[] {
  return stations.filter((s) => s.status === "online");
}

export function getOfflineStations(): Station[] {
  return stations.filter((s) => s.status === "offline");
}

export function getPendingRequests(): AccessRequest[] {
  return accessRequests.filter((r) => r.status === "pending");
}

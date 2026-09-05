import { V } from "@/generated/variables";

export const CABIN_COORDS = { lat: Number(V.GPS_LAT), lon: Number(V.GPS_LON) };

export type OpenMeteoResponse = {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
  };
};

export async function fetchWeather(lat: number, lon: number): Promise<OpenMeteoResponse> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,wind_speed_10m,wind_direction_10m,weather_code");
  url.searchParams.set("daily", "temperature_2m_max,weather_code,sunrise,sunset");
  url.searchParams.set("timezone", "Europe/Prague");
  url.searchParams.set("forecast_days", "5");

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Open-Meteo request failed: ${res.status}`);
  }
  return res.json();
}

export function formatTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  return date.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
}

const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: "Jasno",
  1: "Skoro jasno",
  2: "Polojasno",
  3: "Zataženo",
  45: "Mlha",
  48: "Mlha s jinovatkou",
  51: "Slabé mrholení",
  53: "Mrholení",
  55: "Silné mrholení",
  61: "Slabý déšť",
  63: "Déšť",
  65: "Silný déšť",
  66: "Mrznoucí déšť",
  67: "Silný mrznoucí déšť",
  71: "Slabé sněžení",
  73: "Sněžení",
  75: "Silné sněžení",
  77: "Sněhové zrno",
  80: "Přeháňky",
  81: "Silnější přeháňky",
  82: "Prudké přeháňky",
  85: "Sněhové přeháňky",
  86: "Silné sněhové přeháňky",
  95: "Bouřka",
  96: "Bouřka s kroupami",
  99: "Silná bouřka s kroupami",
};

export function describeWeatherCode(code: number): string {
  return WEATHER_DESCRIPTIONS[code] ?? "Neznámé počasí";
}

const WEATHER_ICONS: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  66: "🌧️",
  67: "🌧️",
  71: "🌨️",
  73: "🌨️",
  75: "❄️",
  77: "🌨️",
  80: "🌦️",
  81: "🌧️",
  82: "⛈️",
  85: "🌨️",
  86: "❄️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

export function weatherIcon(code: number): string {
  return WEATHER_ICONS[code] ?? "🌡️";
}

const COMPASS = ["S", "SV", "V", "JV", "J", "JZ", "Z", "SZ"];

export function degreesToCompass(deg: number): string {
  return COMPASS[Math.round(deg / 45) % 8];
}

const WEEKDAYS_CS = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];

export function weekdayLabel(isoDate: string): string {
  const date = new Date(isoDate);
  return WEEKDAYS_CS[date.getDay()];
}

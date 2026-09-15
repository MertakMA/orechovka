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

export type Locale = "cs" | "en";

export function formatTime(isoDateTime: string, locale: Locale = "cs"): string {
  const date = new Date(isoDateTime);
  return date.toLocaleTimeString(locale === "en" ? "en-GB" : "cs-CZ", { hour: "2-digit", minute: "2-digit" });
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

const WEATHER_DESCRIPTIONS_EN: Record<number, string> = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Heavier rain showers",
  82: "Violent rain showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm with hail",
};

export function describeWeatherCode(code: number, locale: Locale = "cs"): string {
  const dict = locale === "en" ? WEATHER_DESCRIPTIONS_EN : WEATHER_DESCRIPTIONS;
  return dict[code] ?? (locale === "en" ? "Unknown weather" : "Neznámé počasí");
}

export type WeatherKind =
  | "clear"
  | "few-clouds"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

const WEATHER_KINDS: Record<number, WeatherKind> = {
  0: "clear",
  1: "few-clouds",
  2: "partly-cloudy",
  3: "cloudy",
  45: "fog",
  48: "fog",
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",
  61: "rain",
  63: "rain",
  65: "rain",
  66: "rain",
  67: "rain",
  71: "snow",
  73: "snow",
  75: "snow",
  77: "snow",
  80: "rain",
  81: "rain",
  82: "storm",
  85: "snow",
  86: "snow",
  95: "storm",
  96: "storm",
  99: "storm",
};

export function weatherKind(code: number): WeatherKind {
  return WEATHER_KINDS[code] ?? "cloudy";
}

const COMPASS = ["S", "SV", "V", "JV", "J", "JZ", "Z", "SZ"];

export function degreesToCompass(deg: number): string {
  return COMPASS[Math.round(deg / 45) % 8];
}

const WEEKDAYS_CS = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function weekdayLabel(isoDate: string, locale: Locale = "cs"): string {
  const date = new Date(isoDate);
  return (locale === "en" ? WEEKDAYS_EN : WEEKDAYS_CS)[date.getDay()];
}

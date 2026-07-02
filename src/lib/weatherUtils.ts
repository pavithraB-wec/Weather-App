import type { WeatherBundle } from "./api";

// ═══════════════════════════════════════════════════════════
// WMO Weather Code Mapping
// ═══════════════════════════════════════════════════════════
export type IconKey =
  | "sun" | "moon" | "cloud-sun" | "cloud-moon" | "cloud" | "clouds"
  | "fog" | "drizzle" | "rain" | "heavy-rain" | "snow" | "sleet" | "storm";

export type Scene = "sunny" | "night" | "cloudy" | "rain" | "storm" | "snow" | "fog";

interface CodeInfo {
  label: string;
  day: IconKey;
  night: IconKey;
  scene: Scene;
}

const CODES: Record<number, CodeInfo> = {
  0:  { label: "Clear sky",                 day: "sun",       night: "moon",       scene: "sunny" },
  1:  { label: "Mainly clear",              day: "sun",       night: "moon",       scene: "sunny" },
  2:  { label: "Partly cloudy",             day: "cloud-sun", night: "cloud-moon", scene: "cloudy" },
  3:  { label: "Overcast",                  day: "clouds",    night: "clouds",     scene: "cloudy" },
  45: { label: "Fog",                       day: "fog",       night: "fog",        scene: "fog" },
  48: { label: "Depositing rime fog",       day: "fog",       night: "fog",        scene: "fog" },
  51: { label: "Light drizzle",             day: "drizzle",   night: "drizzle",    scene: "rain" },
  53: { label: "Moderate drizzle",          day: "drizzle",   night: "drizzle",    scene: "rain" },
  55: { label: "Dense drizzle",             day: "drizzle",   night: "drizzle",    scene: "rain" },
  56: { label: "Freezing drizzle",          day: "sleet",     night: "sleet",      scene: "rain" },
  57: { label: "Dense freezing drizzle",    day: "sleet",     night: "sleet",      scene: "rain" },
  61: { label: "Light rain",               day: "rain",      night: "rain",       scene: "rain" },
  63: { label: "Moderate rain",             day: "rain",      night: "rain",       scene: "rain" },
  65: { label: "Heavy rain",               day: "heavy-rain", night: "heavy-rain", scene: "rain" },
  66: { label: "Freezing rain",             day: "sleet",     night: "sleet",      scene: "rain" },
  67: { label: "Heavy freezing rain",       day: "sleet",     night: "sleet",      scene: "rain" },
  71: { label: "Light snowfall",            day: "snow",      night: "snow",       scene: "snow" },
  73: { label: "Moderate snowfall",         day: "snow",      night: "snow",       scene: "snow" },
  75: { label: "Heavy snowfall",            day: "snow",      night: "snow",       scene: "snow" },
  77: { label: "Snow grains",               day: "snow",      night: "snow",       scene: "snow" },
  80: { label: "Light rain showers",        day: "rain",      night: "rain",       scene: "rain" },
  81: { label: "Rain showers",              day: "rain",      night: "rain",       scene: "rain" },
  82: { label: "Violent rain showers",      day: "heavy-rain", night: "heavy-rain", scene: "rain" },
  85: { label: "Snow showers",              day: "snow",      night: "snow",       scene: "snow" },
  86: { label: "Heavy snow showers",        day: "snow",      night: "snow",       scene: "snow" },
  95: { label: "Thunderstorm",              day: "storm",     night: "storm",      scene: "storm" },
  96: { label: "Thunderstorm with hail",    day: "storm",     night: "storm",      scene: "storm" },
  99: { label: "Severe thunderstorm",       day: "storm",     night: "storm",      scene: "storm" },
};

export function codeInfo(code: number) {
  return CODES[code] ?? CODES[3];
}
export function codeLabel(code: number) {
  return codeInfo(code).label;
}
export function codeIcon(code: number, isDay: boolean): IconKey {
  const c = codeInfo(code);
  return isDay ? c.day : c.night;
}
export function sceneFor(code: number, isDay: boolean): Scene {
  const s = codeInfo(code).scene;
  if (!isDay && (s === "sunny" || s === "cloudy")) return "night";
  return s;
}

// ═══════════════════════════════════════════════════════════
// Temperature Units
// ═══════════════════════════════════════════════════════════
export type Unit = "c" | "f";
export const toF = (c: number) => (c * 9) / 5 + 32;
export function fmtTemp(c: number, unit: Unit, withUnit = false) {
  const v = unit === "c" ? c : toF(c);
  return `${Math.round(v)}°${withUnit ? unit.toUpperCase() : ""}`;
}

// ═══════════════════════════════════════════════════════════
// Wind Helpers
// ═══════════════════════════════════════════════════════════
const DIRS = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
export function windCompass(deg: number) {
  return DIRS[Math.round(deg / 22.5) % 16];
}
export function windDescription(speed: number) {
  if (speed < 2) return "Calm";
  if (speed < 12) return "Light breeze";
  if (speed < 30) return "Moderate wind";
  if (speed < 50) return "Strong wind";
  if (speed < 75) return "Gale force";
  return "Storm force";
}

// ═══════════════════════════════════════════════════════════
// UV Index
// ═══════════════════════════════════════════════════════════
export function uvInfo(uv: number) {
  if (uv < 3)  return { level: "Low",       color: "#22C55E", icon: "🟢" };
  if (uv < 6)  return { level: "Moderate",  color: "#F59E0B", icon: "🟡" };
  if (uv < 8)  return { level: "High",      color: "#F97316", icon: "🟠" };
  if (uv < 11) return { level: "Very High", color: "#EF4444", icon: "🔴" };
  return { level: "Extreme", color: "#7C3AED", icon: "🟣" };
}

// ═══════════════════════════════════════════════════════════
// AQI (US EPA standard)
// ═══════════════════════════════════════════════════════════
export function aqiInfo(aqi: number) {
  if (aqi <= 50)  return { level: "Good",              color: "#22C55E", emoji: "😊", advice: "Air quality is excellent — a great day for outdoor activities." };
  if (aqi <= 100) return { level: "Moderate",          color: "#F59E0B", emoji: "🙂", advice: "Acceptable air quality. Unusually sensitive people should take care." };
  if (aqi <= 150) return { level: "Unhealthy (Sens.)", color: "#F97316", emoji: "😷", advice: "Sensitive groups should reduce prolonged outdoor exertion." };
  if (aqi <= 200) return { level: "Unhealthy",         color: "#EF4444", emoji: "😰", advice: "Everyone may begin to experience health effects. Limit outdoor time." };
  if (aqi <= 300) return { level: "Very Unhealthy",    color: "#A855F7", emoji: "🤢", advice: "Health alert — avoid outdoor exertion and keep windows closed." };
  return { level: "Hazardous", color: "#7F1D1D", emoji: "☠️", advice: "Emergency conditions. Stay indoors with air purification if possible." };
}

// ═══════════════════════════════════════════════════════════
// Moon Phase Calculator
// ═══════════════════════════════════════════════════════════
export function moonPhase(date = new Date()) {
  const synodic = 29.53058867;
  const known = Date.UTC(2000, 0, 6, 18, 14);
  const days = (date.getTime() - known) / 86400000;
  const phase = ((days % synodic) + synodic) % synodic;
  const idx = Math.floor((phase / synodic) * 8 + 0.5) % 8;
  const names = [
    "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
    "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent",
  ];
  const emojis = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
  const illumination = Math.round((1 - Math.cos((2 * Math.PI * phase) / synodic)) / 2 * 100);
  return { name: names[idx], emoji: emojis[idx], illumination };
}

// ═══════════════════════════════════════════════════════════
// Time Helpers (timezone-aware)
// ═══════════════════════════════════════════════════════════
export function cityNow(offsetSeconds: number) {
  const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
  return new Date(utc + offsetSeconds * 1000);
}
export function fmtClock(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
export function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
export function fmtDateShort(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
export function isoToClock(iso: string) {
  const [, t] = iso.split("T");
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
}
export function isoToHourLabel(iso: string) {
  const h = Number(iso.split("T")[1].split(":")[0]);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh} ${ampm}`;
}
export function isoToDayName(iso: string, index: number) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long" });
}
export function isoToShortDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ═══════════════════════════════════════════════════════════
// Daylight Duration
// ═══════════════════════════════════════════════════════════
export function daylightHours(sunrise: string, sunset: string) {
  const s = new Date(sunrise).getTime();
  const e = new Date(sunset).getTime();
  const hrs = (e - s) / 3600000;
  const h = Math.floor(hrs);
  const m = Math.round((hrs - h) * 60);
  return { hours: h, minutes: m, total: hrs, formatted: `${h}h ${m}m` };
}

export function sunProgress(sunrise: string, sunset: string, currentTime: string) {
  const s = new Date(sunrise).getTime();
  const e = new Date(sunset).getTime();
  const n = new Date(currentTime).getTime();
  if (n <= s) return 0;
  if (n >= e) return 100;
  return ((n - s) / (e - s)) * 100;
}

// ═══════════════════════════════════════════════════════════
// Weather Alerts (derived from conditions)
// ═══════════════════════════════════════════════════════════
export interface WeatherAlert {
  title: string;
  detail: string;
  severity: "info" | "warning" | "danger";
  icon: string;
}

export function deriveAlerts(b: WeatherBundle): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const c = b.current;
  const today = b.daily[0];

  if ([95, 96, 99].includes(c.weatherCode) || b.hourly.slice(0, 12).some(h => [95, 96, 99].includes(h.weatherCode))) {
    alerts.push({ title: "⚡ Thunderstorm Warning", detail: "Thunderstorms expected within the next 12 hours. Stay indoors and away from open areas.", severity: "danger", icon: "⛈️" });
  }
  if ([65, 82].includes(c.weatherCode) || (today && today.precipProbability >= 80 && [61, 63, 65, 80, 81, 82].includes(today.weatherCode))) {
    alerts.push({ title: "🌧️ Heavy Rain Warning", detail: "Heavy rainfall likely today. Watch for localized flooding and reduced visibility on roads.", severity: "warning", icon: "🌊" });
  }
  if (today && today.tempMax >= 42) {
    alerts.push({ title: "🔥 Extreme Heat Alert", detail: `Dangerously high temperatures reaching ${Math.round(today.tempMax)}°C today. Avoid direct sun and stay hydrated.`, severity: "danger", icon: "🌡️" });
  } else if (today && today.tempMax >= 37) {
    alerts.push({ title: "☀️ Heat Advisory", detail: `High temperatures reaching ${Math.round(today.tempMax)}°C today. Limit strenuous outdoor activity in the afternoon.`, severity: "warning", icon: "🌡️" });
  }
  if (c.windGusts >= 70) {
    alerts.push({ title: "💨 Strong Wind Warning", detail: `Wind gusts up to ${Math.round(c.windGusts)} km/h. Secure loose outdoor items and exercise caution.`, severity: "danger", icon: "🌪️" });
  } else if (c.windGusts >= 50) {
    alerts.push({ title: "💨 Wind Advisory", detail: `Wind gusts up to ${Math.round(c.windGusts)} km/h expected. Be cautious outdoors.`, severity: "warning", icon: "🌬️" });
  }
  if ([75, 86].includes(c.weatherCode)) {
    alerts.push({ title: "❄️ Heavy Snow Warning", detail: "Heavy snowfall in progress. Travel may be hazardous — drive carefully and avoid unnecessary trips.", severity: "warning", icon: "🌨️" });
  }
  if (today && today.tempMin <= -15) {
    alerts.push({ title: "🥶 Extreme Cold Alert", detail: `Lows near ${Math.round(today.tempMin)}°C expected. Dress in layers and limit time outdoors.`, severity: "danger", icon: "❄️" });
  } else if (today && today.tempMin <= -5) {
    alerts.push({ title: "🧊 Frost Advisory", detail: `Low temperatures near ${Math.round(today.tempMin)}°C. Protect plants and exposed pipes.`, severity: "info", icon: "🌡️" });
  }

  return alerts;
}

// ═══════════════════════════════════════════════════════════
// Hourly Slice (starting from current hour)
// ═══════════════════════════════════════════════════════════
export function next24Hours(b: WeatherBundle) {
  const nowIso = b.current.time.slice(0, 13);
  let start = b.hourly.findIndex(h => h.time.slice(0, 13) >= nowIso);
  if (start < 0) start = 0;
  return b.hourly.slice(start, start + 24);
}

// ═══════════════════════════════════════════════════════════
// Comfort Level
// ═══════════════════════════════════════════════════════════
export function comfortLevel(temp: number, humidity: number) {
  if (temp >= 18 && temp <= 26 && humidity >= 30 && humidity <= 60) return { level: "Excellent", color: "#22C55E", score: 95 };
  if (temp >= 15 && temp <= 30 && humidity >= 25 && humidity <= 70) return { level: "Comfortable", color: "#60A5FA", score: 75 };
  if (temp >= 10 && temp <= 35 && humidity >= 20 && humidity <= 80) return { level: "Moderate", color: "#F59E0B", score: 50 };
  return { level: "Uncomfortable", color: "#EF4444", score: 25 };
}

import { Wind, Droplets, Gauge, Eye, Sun, Leaf, Navigation2, Activity } from "lucide-react";
import type { WeatherBundle } from "../lib/api";
import { aqiInfo, next24Hours, uvInfo, windCompass, windDescription, comfortLevel } from "../lib/weatherUtils";

export default function Highlights({ bundle }: { bundle: WeatherBundle }) {
  const { current, air } = bundle;
  const h0 = next24Hours(bundle)[0];
  const uv = h0?.uvIndex ?? 0;
  const visKm = (h0?.visibility ?? 0) / 1000;
  const uvi = uvInfo(uv);
  const aqi = air.usAqi != null ? aqiInfo(air.usAqi) : null;
  const comfort = comfortLevel(current.temperature, current.humidity);

  const cards = [
    {
      icon: Wind, title: "Wind Speed",
      value: `${Math.round(current.windSpeed)}`, suffix: "km/h",
      footer: (
        <span className="inline-flex items-center gap-1">
          <Navigation2 size={11} style={{ transform: `rotate(${current.windDirection}deg)` }} className="text-primary" />
          {windCompass(current.windDirection)} · {windDescription(current.windSpeed)}
        </span>
      ),
      extra: `Gusts up to ${Math.round(current.windGusts)} km/h`,
    },
    {
      icon: Droplets, title: "Humidity",
      value: `${current.humidity}`, suffix: "%",
      footer: current.humidity > 75 ? "High — may feel sticky" : current.humidity < 30 ? "Low — consider humidifier" : "Comfortable moisture level",
      bar: { pct: current.humidity, color: "#3B82F6" },
    },
    {
      icon: Gauge, title: "Pressure",
      value: `${Math.round(current.pressure)}`, suffix: "hPa",
      footer: current.pressure >= 1020 ? "High pressure — settled weather" : current.pressure >= 1013 ? "Normal atmospheric pressure" : "Low pressure — expect changes",
    },
    {
      icon: Eye, title: "Visibility",
      value: visKm.toFixed(visKm < 10 ? 1 : 0), suffix: "km",
      footer: visKm >= 10 ? "Excellent — clear conditions" : visKm >= 4 ? "Moderate visibility" : "Poor — exercise caution",
      bar: { pct: Math.min((visKm / 20) * 100, 100), color: visKm >= 10 ? "#22C55E" : visKm >= 4 ? "#F59E0B" : "#EF4444" },
    },
    {
      icon: Sun, title: "UV Index",
      value: uv.toFixed(1), suffix: uvi.level,
      suffixColor: uvi.color,
      footer: uv < 3 ? "Low risk — no protection needed" : uv < 6 ? "Wear SPF 30+ outdoors" : uv < 8 ? "Avoid midday sun exposure" : "Seek shade, wear hat & sunscreen",
      bar: { pct: Math.min((uv / 11) * 100, 100), color: uvi.color },
    },
    {
      icon: Leaf, title: "Air Quality",
      value: air.usAqi != null ? `${Math.round(air.usAqi)}` : "—",
      suffix: aqi ? aqi.level : "AQI",
      suffixColor: aqi?.color,
      footer: air.pm25 != null ? `PM2.5: ${air.pm25.toFixed(1)} µg/m³` : "US EPA Air Quality Index",
      bar: air.usAqi != null ? { pct: Math.min((air.usAqi / 300) * 100, 100), color: aqi!.color } : undefined,
    },
  ];

  return (
    <section className="anim-fade-up anim-d-1">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-ink">Today's Highlights</h2>
        <div className="inline-flex items-center gap-2 rounded-full bg-white border border-line px-3 py-1.5 text-xs font-medium shadow-sm">
          <Activity size={12} className="text-primary" />
          <span className="text-inkmuted">Comfort:</span>
          <span className="font-bold" style={{ color: comfort.color }}>{comfort.level}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-3.5 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <div key={c.title} className="card lift group p-4 sm:p-5">
            <div className="flex items-center gap-2 text-inkmuted">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-hoverblue text-primary transition-colors group-hover:bg-blue-100">
                <c.icon size={15} />
              </span>
              <span className="text-[11px] font-semibold tracking-wide uppercase">{c.title}</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-ink tracking-tight">{c.value}</span>
              <span className="text-[11px] font-bold" style={{ color: (c as any).suffixColor ?? "#94A3B8" }}>
                {c.suffix}
              </span>
            </div>
            {"bar" in c && c.bar && (
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${c.bar.pct}%`, background: c.bar.color }}
                />
              </div>
            )}
            <p className="mt-2 text-[10.5px] leading-snug text-inkmuted">{c.footer}</p>
            {"extra" in c && c.extra && (
              <p className="mt-1 text-[10px] font-medium text-primary/70">{c.extra}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

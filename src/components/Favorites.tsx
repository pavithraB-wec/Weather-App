import { useEffect, useState } from "react";
import { Star, MapPin, TrendingUp, TrendingDown } from "lucide-react";
import { fetchMiniBatch, type GeoCity } from "../lib/api";
import { codeIcon, fmtTemp, type Unit } from "../lib/weatherUtils";
import WeatherIcon from "./WeatherIcon";

export const FAVORITE_CITIES: GeoCity[] = [
  { id: 5128581, name: "New York",    country: "United States",  countryCode: "US", latitude: 40.7143, longitude: -74.006 },
  { id: 2643743, name: "London",      country: "United Kingdom", countryCode: "GB", latitude: 51.5085, longitude: -0.1257 },
  { id: 1850144, name: "Tokyo",       country: "Japan",          countryCode: "JP", latitude: 35.6895, longitude: 139.6917 },
  { id: 1264527, name: "Chennai",     country: "India",          countryCode: "IN", latitude: 13.0878, longitude: 80.2785 },
  { id: 1277333, name: "Bangalore",   country: "India",          countryCode: "IN", latitude: 12.9719, longitude: 77.5937 },
  { id: 1259425, name: "Puducherry",  country: "India",          countryCode: "IN", latitude: 11.9333, longitude: 79.8333 },
];

interface Mini { temp: number; code: number; isDay: boolean; high: number; low: number }

export default function Favorites({
  unit, activeId, onSelect,
}: { unit: Unit; activeId?: number; onSelect: (c: GeoCity) => void }) {
  const [minis, setMinis] = useState<Record<number, Mini>>({});

  useEffect(() => {
    fetchMiniBatch(FAVORITE_CITIES).then(setMinis).catch(() => {});
  }, []);

  return (
    <section className="anim-fade-up anim-d-6">
      <div className="mb-4 flex items-center gap-2">
        <Star size={17} className="text-amber-400 fill-amber-400" />
        <h2 className="text-lg font-bold text-ink">Favorite Cities</h2>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {FAVORITE_CITIES.map((c) => {
          const m = minis[c.id];
          const active = activeId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className={`card lift ripple-btn group flex flex-col gap-2 p-3.5 sm:p-4 text-left transition-all ${
                active ? "border-primary ring-2 ring-blue-100/60 bg-gradient-to-b from-blue-50/30 to-white" : ""
              }`}
            >
              {/* Top row: flag-like badge + icon */}
              <div className="flex w-full items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-inkmuted bg-surface rounded px-1.5 py-0.5">
                  <MapPin size={9} className="text-primary" /> {c.countryCode}
                </span>
                {m && <WeatherIcon icon={codeIcon(m.code, m.isDay)} size={20} />}
              </div>

              {/* City name */}
              <span className="text-sm font-bold text-ink group-hover:text-primary transition-colors">{c.name}</span>

              {/* Temperature */}
              <div>
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary leading-tight">
                  {m ? fmtTemp(m.temp, unit) : "· ·"}
                </span>
                {m && (
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-inkmuted">
                    <span className="inline-flex items-center gap-0.5">
                      <TrendingUp size={9} className="text-danger" /> {fmtTemp(m.high, unit)}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <TrendingDown size={9} className="text-primary" /> {fmtTemp(m.low, unit)}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

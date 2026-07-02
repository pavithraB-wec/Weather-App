import { useState } from "react";
import { CloudRain, Cloud, Thermometer, Wind, Map as MapIcon, ExternalLink } from "lucide-react";
import type { GeoCity } from "../lib/api";

const LAYERS = [
  { key: "clouds", label: "Clouds", icon: Cloud },
  { key: "rain", label: "Rain", icon: CloudRain },
  { key: "temp", label: "Temp", icon: Thermometer },
  { key: "wind", label: "Wind", icon: Wind },
] as const;

export default function MapCard({ city }: { city: GeoCity }) {
  const [layer, setLayer] = useState<(typeof LAYERS)[number]["key"]>("clouds");

  const src =
    `https://embed.windy.com/embed2.html?lat=${city.latitude.toFixed(3)}&lon=${city.longitude.toFixed(3)}` +
    `&detailLat=${city.latitude.toFixed(3)}&detailLon=${city.longitude.toFixed(3)}` +
    `&zoom=6&level=surface&overlay=${layer}&product=ecmwf&menu=&message=&marker=true` +
    `&calendar=now&pressure=&type=map&location=coordinates&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;

  return (
    <section className="anim-fade-up anim-d-5 card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-hoverblue to-blue-100 text-primary shadow-sm">
            <MapIcon size={18} />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-bold leading-tight text-ink">Weather Map</h2>
            <p className="text-[11px] text-inkmuted">Live data around {city.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {LAYERS.map((l) => (
              <button
                key={l.key}
                onClick={() => setLayer(l.key)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-bold transition active:scale-95 ${
                  layer === l.key
                    ? "border-primary bg-primary text-white shadow-sm shadow-blue-200/50"
                    : "border-line bg-white text-inkmuted hover:bg-hoverblue hover:text-primary"
                }`}
              >
                <l.icon size={12} /> {l.label}
              </button>
            ))}
          </div>
          <a
            href={`https://www.windy.com/${city.latitude.toFixed(3)}/${city.longitude.toFixed(3)}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:grid h-8 w-8 place-items-center rounded-full border border-line bg-white text-inkmuted hover:bg-hoverblue hover:text-primary transition"
            title="Open in Windy"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
      <div className="h-[340px] sm:h-[400px] lg:h-[440px] bg-hoverblue">
        <iframe
          key={`${layer}-${city.latitude}-${city.longitude}`}
          title="Weather map"
          src={src}
          className="h-full w-full border-0"
          loading="lazy"
          allow="geolocation"
        />
      </div>
    </section>
  );
}

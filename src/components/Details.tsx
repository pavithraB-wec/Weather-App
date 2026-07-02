import {
  Droplets, Navigation2, Gauge, Cloud, Eye, CloudDrizzle, Thermometer, Sunrise, Sunset, Timer,
} from "lucide-react";
import type { WeatherBundle } from "../lib/api";
import { fmtTemp, isoToClock, moonPhase, next24Hours, windCompass, daylightHours, type Unit } from "../lib/weatherUtils";

export default function Details({ bundle, unit }: { bundle: WeatherBundle; unit: Unit }) {
  const { current, daily } = bundle;
  const h0 = next24Hours(bundle)[0];
  const moon = moonPhase();
  const daylight = daylightHours(daily[0].sunrise, daily[0].sunset);

  const items = [
    { icon: Droplets, label: "Humidity", value: `${current.humidity}%`, sub: current.humidity > 70 ? "Humid conditions" : current.humidity < 30 ? "Dry conditions" : "Comfortable" },
    {
      icon: Navigation2, label: "Wind Direction",
      value: windCompass(current.windDirection),
      sub: `${Math.round(current.windDirection)}° bearing`,
      rotate: current.windDirection,
    },
    { icon: Gauge, label: "Pressure", value: `${Math.round(current.pressure)} hPa`, sub: "Mean sea level" },
    { icon: Cloud, label: "Cloud Cover", value: `${current.cloudCover}%`, sub: current.cloudCover > 80 ? "Overcast skies" : current.cloudCover > 40 ? "Partly cloudy" : "Mostly clear" },
    { icon: Eye, label: "Visibility", value: `${((h0?.visibility ?? 0) / 1000).toFixed(1)} km`, sub: "Horizontal range" },
    { icon: CloudDrizzle, label: "Dew Point", value: fmtTemp(h0?.dewPoint ?? 0, unit, true), sub: "Moisture saturation temp" },
    { icon: Thermometer, label: "Feels Like", value: fmtTemp(current.apparentTemperature, unit, true), sub: "Apparent temperature" },
    { icon: Sunrise, label: "Sunrise", value: isoToClock(daily[0].sunrise), sub: "Local solar time" },
    { icon: Sunset, label: "Sunset", value: isoToClock(daily[0].sunset), sub: "Local solar time" },
    { icon: Timer, label: "Daylight", value: daylight.formatted, sub: `${Math.round(daily[0].sunshineDuration / 3600)}h sunshine` },
    { icon: null, label: "Moon Phase", value: moon.name, sub: `${moon.illumination}% illuminated`, emoji: moon.emoji },
    { icon: Cloud, label: "Precipitation", value: `${current.precipitation} mm`, sub: "Current precipitation" },
  ];

  return (
    <section className="anim-fade-up anim-d-4">
      <h2 className="mb-4 text-lg font-bold text-ink">Weather Details</h2>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {items.map((it) => (
          <div key={it.label} className="card lift group flex flex-col p-3.5 sm:p-4">
            <div className="flex items-center gap-2 text-inkmuted">
              {it.icon ? (
                <span className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-lg sm:rounded-xl bg-hoverblue text-primary transition-colors group-hover:bg-blue-100">
                  <it.icon
                    size={14}
                    style={"rotate" in it && it.rotate != null ? { transform: `rotate(${it.rotate}deg)` } : undefined}
                  />
                </span>
              ) : (
                <span className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-lg sm:rounded-xl bg-hoverblue text-sm">{(it as any).emoji}</span>
              )}
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide">{it.label}</span>
            </div>
            <p className="mt-2.5 text-base sm:text-lg font-bold text-ink leading-tight">{it.value}</p>
            <p className="mt-0.5 text-[10px] sm:text-[10.5px] text-inkmuted leading-snug">{it.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import { Umbrella } from "lucide-react";
import type { WeatherBundle } from "../lib/api";
import { codeIcon, codeLabel, fmtTemp, isoToDayName, isoToShortDate, toF, type Unit } from "../lib/weatherUtils";
import WeatherIcon from "./WeatherIcon";

export default function Daily({ bundle, unit }: { bundle: WeatherBundle; unit: Unit }) {
  const days = bundle.daily.slice(0, 7);
  const globalMin = Math.min(...days.map(d => d.tempMin));
  const globalMax = Math.max(...days.map(d => d.tempMax));
  const span = Math.max(globalMax - globalMin, 1);

  return (
    <section className="anim-fade-up anim-d-3 card p-5 sm:p-6 h-full">
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-ink">7-Day Forecast</h2>
        <span className="text-xs text-inkmuted font-medium">{unit === "c" ? "Celsius" : "Fahrenheit"}</span>
      </div>

      <div className="space-y-0.5">
        {days.map((d, i) => {
          const left = ((d.tempMin - globalMin) / span) * 100;
          const width = ((d.tempMax - d.tempMin) / span) * 100;
          const isToday = i === 0;

          return (
            <div
              key={d.date}
              className={`group flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 rounded-xl px-2.5 -mx-2.5 transition-colors ${
                isToday ? "bg-hoverblue/40" : "hover:bg-hoverblue/30"
              }`}
            >
              {/* Day name & date */}
              <div className="w-[80px] sm:w-[100px] shrink-0">
                <p className={`text-sm font-bold ${isToday ? "text-primary" : "text-ink"}`}>
                  {isoToDayName(d.date, i)}
                </p>
                <p className="text-[10px] text-inkmuted font-medium">{isoToShortDate(d.date)}</p>
              </div>

              {/* Icon */}
              <WeatherIcon icon={codeIcon(d.weatherCode, true)} size={24} className="shrink-0" />

              {/* Condition label (desktop) */}
              <div className="hidden sm:block min-w-0 flex-1">
                <p className="truncate text-xs text-inkmuted capitalize font-medium">{codeLabel(d.weatherCode)}</p>
              </div>

              {/* Rain chance */}
              <span className={`inline-flex w-[46px] shrink-0 items-center gap-0.5 text-[11px] font-semibold ${
                d.precipProbability > 50 ? "text-primary" : "text-inkmuted"
              }`}>
                <Umbrella size={10} /> {Math.round(d.precipProbability)}%
              </span>

              {/* Low temp */}
              <span className="w-8 shrink-0 text-right text-xs font-medium text-inkmuted">
                {Math.round(unit === "c" ? d.tempMin : toF(d.tempMin))}°
              </span>

              {/* Temperature range bar */}
              <div className="relative hidden h-[5px] w-16 md:w-20 lg:w-24 shrink-0 rounded-full bg-surface md:block overflow-hidden">
                <div
                  className="absolute h-full rounded-full temp-bar-gradient transition-all duration-500"
                  style={{ left: `${left}%`, width: `${Math.max(width, 10)}%` }}
                />
              </div>

              {/* High temp */}
              <span className="w-8 shrink-0 text-right text-sm font-extrabold text-ink">
                {fmtTemp(d.tempMax, unit)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

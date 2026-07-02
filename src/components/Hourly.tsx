import { useRef, useState } from "react";
import { Umbrella, Wind, ChevronLeft, ChevronRight } from "lucide-react";
import type { WeatherBundle } from "../lib/api";
import { codeIcon, fmtTemp, isoToHourLabel, next24Hours, type Unit } from "../lib/weatherUtils";
import WeatherIcon from "./WeatherIcon";

export default function Hourly({ bundle, unit }: { bundle: WeatherBundle; unit: Unit }) {
  const hours = next24Hours(bundle);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  // Find min/max temps for gradient-intensity calc
  const temps = hours.map(h => h.temperature);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(maxTemp - minTemp, 1);

  return (
    <section className="anim-fade-up anim-d-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Hourly Forecast</h2>
        <div className="flex items-center gap-1.5">
          <span className="mr-2 text-xs text-inkmuted hidden sm:block">Next 24 hours</span>
          <button
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            className="grid h-8 w-8 place-items-center rounded-full border border-line bg-white text-inkmuted transition hover:bg-hoverblue hover:text-primary disabled:opacity-30 disabled:cursor-default"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            className="grid h-8 w-8 place-items-center rounded-full border border-line bg-white text-inkmuted transition hover:bg-hoverblue hover:text-primary disabled:opacity-30 disabled:cursor-default"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="no-scrollbar -mx-1 flex gap-2.5 sm:gap-3 overflow-x-auto px-1 pb-2"
      >
        {hours.map((h, i) => {
          const intensity = (h.temperature - minTemp) / tempRange;
          const borderColor = i === 0 ? "border-primary/40" : "border-line";

          return (
            <div
              key={h.time}
              className={`card lift flex min-w-[100px] sm:min-w-[108px] shrink-0 flex-col items-center gap-1.5 sm:gap-2 px-3 py-3.5 sm:py-4 transition-all ${borderColor} ${
                i === 0 ? "ring-2 ring-blue-100/60 bg-gradient-to-b from-blue-50/40 to-white" : ""
              }`}
            >
              <span className={`text-[11px] font-bold ${i === 0 ? "text-primary" : "text-inkmuted"}`}>
                {i === 0 ? "Now" : isoToHourLabel(h.time)}
              </span>

              <WeatherIcon icon={codeIcon(h.weatherCode, h.isDay)} size={30} />

              <span className="text-base sm:text-lg font-bold text-ink leading-tight">{fmtTemp(h.temperature, unit)}</span>

              {/* Mini temperature intensity bar */}
              <div className="w-8 h-1 rounded-full bg-surface overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${intensity * 100}%`,
                    background: `hsl(${210 - intensity * 30}, 80%, ${55 - intensity * 10}%)`,
                  }}
                />
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary/80">
                  <Umbrella size={10} /> {Math.round(h.precipProbability)}%
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] text-inkmuted">
                  <Wind size={10} /> {Math.round(h.windSpeed)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

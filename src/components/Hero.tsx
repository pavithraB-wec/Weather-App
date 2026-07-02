import { useEffect, useState } from "react";
import { MapPin, Droplets, Wind, Gauge, Eye, Sunrise, Sunset, Thermometer, Clock, TrendingUp, TrendingDown, CloudRain } from "lucide-react";
import type { WeatherBundle } from "../lib/api";
import {
  cityNow, codeIcon, codeLabel, fmtClock, fmtDate, fmtTemp, isoToClock,
  next24Hours, daylightHours, sunProgress, type Unit,
} from "../lib/weatherUtils";
import WeatherIcon from "./WeatherIcon";

export default function Hero({ bundle, unit }: { bundle: WeatherBundle; unit: Unit }) {
  const { city, current, daily } = bundle;
  const [now, setNow] = useState(() => cityNow(bundle.utcOffsetSeconds));

  useEffect(() => {
    setNow(cityNow(bundle.utcOffsetSeconds));
    const t = setInterval(() => setNow(cityNow(bundle.utcOffsetSeconds)), 20_000);
    return () => clearInterval(t);
  }, [bundle]);

  const h0 = next24Hours(bundle)[0];
  const uvNow = h0?.uvIndex ?? 0;
  const visKm = (h0?.visibility ?? 0) / 1000;
  const daylight = daylightHours(daily[0].sunrise, daily[0].sunset);
  const sunProg = sunProgress(daily[0].sunrise, daily[0].sunset, current.time);

  const quickStats = [
    { icon: Thermometer, label: "Feels Like", value: fmtTemp(current.apparentTemperature, unit), accent: false },
    { icon: Droplets, label: "Humidity", value: `${current.humidity}%`, accent: false },
    { icon: Wind, label: "Wind", value: `${Math.round(current.windSpeed)} km/h`, accent: false },
    { icon: Gauge, label: "Pressure", value: `${Math.round(current.pressure)} hPa`, accent: false },
    { icon: Eye, label: "Visibility", value: `${visKm.toFixed(visKm < 10 ? 1 : 0)} km`, accent: false },
    { icon: CloudRain, label: "Rain Chance", value: `${Math.round(daily[0].precipProbability)}%`, accent: daily[0].precipProbability > 50 },
  ];

  return (
    <section className="anim-fade-up">
      <div className="card-glass relative overflow-hidden">
        {/* Background accent gradients */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: current.isDay
            ? "linear-gradient(125deg, rgba(219,239,255,.7) 0%, rgba(255,255,255,0) 50%), radial-gradient(circle at 95% -5%, rgba(186,230,253,.6), transparent 40%)"
            : "linear-gradient(125deg, rgba(224,231,255,.6) 0%, rgba(255,255,255,0) 50%), radial-gradient(circle at 95% -5%, rgba(199,210,254,.5), transparent 40%)",
        }} />

        <div className="relative p-5 sm:p-7 lg:p-9">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-10">
            {/* ── Left: Main Weather ── */}
            <div className="space-y-5">
              {/* Location & Time */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 border border-line px-3 py-1 font-semibold text-primary shadow-sm">
                  <MapPin size={13} strokeWidth={2.2} />
                  {city.name}{city.country ? `, ${city.country}` : ""}
                </span>
                <span className="inline-flex items-center gap-1.5 text-inkmuted">
                  <Clock size={13} /> {fmtClock(now)}
                </span>
                <span className="hidden sm:inline text-inkmuted text-xs">{fmtDate(now)}</span>
              </div>

              {/* Temperature Display */}
              <div className="flex items-center gap-5 sm:gap-8">
                <div className="floaty shrink-0">
                  <WeatherIcon icon={codeIcon(current.weatherCode, current.isDay)} size={88} strokeWidth={1.3} withGlow />
                </div>
                <div>
                  <div className="flex items-start">
                    <span className="text-7xl sm:text-8xl lg:text-[6.5rem] font-extralight leading-[0.85] tracking-[-0.04em] text-ink">
                      {fmtTemp(current.temperature, unit)}
                    </span>
                  </div>
                  <p className="mt-2 text-base sm:text-lg font-semibold capitalize text-ink/80">{codeLabel(current.weatherCode)}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-sm text-inkmuted">
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp size={13} className="text-danger" />
                      <span className="font-semibold text-ink">{fmtTemp(daily[0].tempMax, unit)}</span>
                    </span>
                    <span className="w-px h-3.5 bg-line" />
                    <span className="inline-flex items-center gap-1">
                      <TrendingDown size={13} className="text-primary" />
                      <span className="font-semibold text-ink">{fmtTemp(daily[0].tempMin, unit)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Sunrise/Sunset arc */}
              <div className="flex items-center gap-4 rounded-2xl bg-white/50 border border-line/50 px-4 py-3">
                <div className="relative w-full max-w-[180px]">
                  <svg viewBox="0 0 200 60" className="w-full">
                    {/* Arc track */}
                    <path d="M 10 55 Q 100 -20 190 55" fill="none" stroke="#D6ECFF" strokeWidth="3" strokeLinecap="round" />
                    {/* Arc progress */}
                    <path
                      d="M 10 55 Q 100 -20 190 55"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="220"
                      strokeDashoffset={220 - (220 * Math.min(Math.max(sunProg, 0), 100)) / 100}
                    />
                    {/* Sun dot */}
                    {sunProg > 0 && sunProg < 100 && (
                      <circle
                        cx={10 + (180 * sunProg) / 100}
                        cy={55 - Math.sin((sunProg / 100) * Math.PI) * 65}
                        r="6"
                        fill="#FBBF24"
                        stroke="white"
                        strokeWidth="2"
                      />
                    )}
                    {/* Horizon line */}
                    <line x1="5" y1="56" x2="195" y2="56" stroke="#D6ECFF" strokeWidth="1" strokeDasharray="3 3" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-inkmuted">
                    <Sunrise size={13} className="text-amber-400" />
                    <span className="font-semibold text-ink">{isoToClock(daily[0].sunrise)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-inkmuted">
                    <Sunset size={13} className="text-orange-400" />
                    <span className="font-semibold text-ink">{isoToClock(daily[0].sunset)}</span>
                  </span>
                  <span className="text-[10px] text-inkmuted">{daylight.formatted} of daylight</span>
                </div>
              </div>
            </div>

            {/* ── Right: Quick Stats Grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2.5 sm:gap-3 content-center">
              {quickStats.map((s) => (
                <div
                  key={s.label}
                  className={`lift rounded-xl border bg-white/60 backdrop-blur-sm px-3.5 py-3 ${
                    s.accent ? "border-blue-200 bg-blue-50/40" : "border-line/60"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-inkmuted">
                    <s.icon size={13} className="text-secondary" />
                    <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider">{s.label}</span>
                  </div>
                  <p className="mt-1.5 text-lg font-bold text-ink leading-tight">{s.value}</p>
                </div>
              ))}
              {/* UV Compact */}
              <div className="lift rounded-xl border border-line/60 bg-white/60 backdrop-blur-sm px-3.5 py-3 col-span-2 sm:col-span-1 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-inkmuted">
                      <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider">UV Index</span>
                    </div>
                    <p className="mt-1 text-lg font-bold text-ink">{uvNow.toFixed(1)}</p>
                  </div>
                  <div className="h-1.5 w-24 sm:w-28 rounded-full overflow-hidden" style={{ background: "linear-gradient(90deg,#22C55E,#F59E0B,#F97316,#EF4444,#7C3AED)" }}>
                    <div className="relative h-full">
                      <span
                        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-ink shadow-sm"
                        style={{ left: `${Math.min((uvNow / 11) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Leaf, ShieldCheck, Siren, Info } from "lucide-react";
import type { WeatherBundle } from "../lib/api";
import { aqiInfo, deriveAlerts } from "../lib/weatherUtils";

// ═════════════════════════════════════════════════════════
// Air Quality Card
// ═════════════════════════════════════════════════════════
export function AirQualityCard({ bundle }: { bundle: WeatherBundle }) {
  const { air } = bundle;
  const has = air.usAqi != null;
  const info = has ? aqiInfo(air.usAqi!) : null;
  const pct = has ? Math.min((air.usAqi! / 300) * 100, 100) : 0;

  return (
    <section className="anim-fade-up anim-d-4 card p-5 sm:p-6 h-full">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-green-50 to-hoverblue text-primary shadow-sm">
          <Leaf size={18} />
        </span>
        <div>
          <h2 className="text-base sm:text-lg font-bold leading-tight text-ink">Air Quality</h2>
          <p className="text-[11px] text-inkmuted">US AQI · {bundle.city.name}</p>
        </div>
      </div>

      {has ? (
        <>
          <div className="flex items-end gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: info!.color }}>
              {Math.round(air.usAqi!)}
            </span>
            <div className="mb-1 flex items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-sm"
                style={{ background: info!.color }}
              >
                {info!.level}
              </span>
              <span className="text-lg">{info!.emoji}</span>
            </div>
          </div>

          {/* Gradient bar */}
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full"
            style={{ background: "linear-gradient(90deg,#22C55E 0%,#F59E0B 33%,#F97316 50%,#EF4444 66%,#A855F7 83%,#7F1D1D 100%)" }}>
            <div className="relative h-full">
              <span
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-[2.5px] border-white bg-ink shadow-md transition-all duration-500"
                style={{ left: `${pct}%` }}
              />
            </div>
          </div>

          {/* Health advice */}
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-hoverblue/60 border border-line/50 p-3">
            <ShieldCheck size={15} className="mt-0.5 shrink-0 text-primary" />
            <p className="text-[11px] leading-relaxed text-ink/80">{info!.advice}</p>
          </div>

          {/* Pollutant grid */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {([
              ["PM2.5", air.pm25, "µg/m³"],
              ["PM10", air.pm10, "µg/m³"],
              ["O₃", air.ozone, "µg/m³"],
              ["NO₂", air.no2, "µg/m³"],
            ] as const).map(([k, v, u]) => (
              <div key={k} className="rounded-xl border border-line bg-white/60 px-2.5 py-2 text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-inkmuted">{k}</p>
                <p className="mt-0.5 text-sm font-bold text-ink">{v != null ? v.toFixed(1) : "—"}</p>
                <p className="text-[8px] text-inkmuted">{u}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3 rounded-xl bg-surface p-4">
          <Info size={18} className="shrink-0 text-inkmuted" />
          <p className="text-sm text-inkmuted">Air quality data unavailable for this location.</p>
        </div>
      )}
    </section>
  );
}

// ═════════════════════════════════════════════════════════
// Weather Alerts Card
// ═════════════════════════════════════════════════════════
export function AlertsCard({ bundle }: { bundle: WeatherBundle }) {
  const alerts = deriveAlerts(bundle);

  return (
    <section className="anim-fade-up anim-d-5 card p-5 sm:p-6 h-full">
      <div className="mb-5 flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-2xl shadow-sm ${
          alerts.length > 0
            ? "bg-gradient-to-br from-amber-50 to-orange-50 text-amber-500"
            : "bg-gradient-to-br from-green-50 to-emerald-50 text-green-500"
        }`}>
          {alerts.length > 0 ? <Siren size={18} /> : <ShieldCheck size={18} />}
        </span>
        <div>
          <h2 className="text-base sm:text-lg font-bold leading-tight text-ink">Weather Alerts</h2>
          <p className="text-[11px] text-inkmuted">
            {alerts.length > 0 ? `${alerts.length} active alert${alerts.length > 1 ? "s" : ""}` : "No active alerts"}
          </p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50/50 p-4">
          <ShieldCheck size={22} className="shrink-0 text-green-500" />
          <div>
            <p className="text-sm font-semibold text-ink">All Clear</p>
            <p className="mt-0.5 text-[11px] text-inkmuted leading-relaxed">
              No severe weather expected. Conditions look calm for {bundle.city.name}.
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {alerts.map((a, i) => (
            <li
              key={`${a.title}-${i}`}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 transition-colors ${
                a.severity === "danger"
                  ? "border-red-100 bg-red-50/40"
                  : a.severity === "warning"
                  ? "border-amber-100 bg-amber-50/40"
                  : "border-blue-100 bg-blue-50/40"
              }`}
            >
              <span className="mt-0.5 text-lg shrink-0">{a.icon}</span>
              <div>
                <p className="text-sm font-bold text-ink">{a.title}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-inkmuted">{a.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

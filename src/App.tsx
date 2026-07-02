import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, Loader2 } from "lucide-react";
import { fetchWeatherBundle, reverseGeocode, type GeoCity, type WeatherBundle } from "./lib/api";
import { sceneFor, type Unit } from "./lib/weatherUtils";
import WeatherBackground from "./components/WeatherBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import Hourly from "./components/Hourly";
import Daily from "./components/Daily";
import Details from "./components/Details";
import { AirQualityCard, AlertsCard } from "./components/AirAlerts";
import MapCard from "./components/MapCard";
import Favorites from "./components/Favorites";
import Footer from "./components/Footer";
import { LoadingSkeleton, EmptyState, ErrorState } from "./components/States";

type Status = "idle" | "loading" | "ready" | "error";

export default function App() {
  const [unit, setUnit] = useState<Unit>(() => (localStorage.getItem("skycast-unit") as Unit) || "c");
  const [status, setStatus] = useState<Status>("idle");
  const [bundle, setBundle] = useState<WeatherBundle | null>(null);
  const [city, setCity] = useState<GeoCity | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [pull, setPull] = useState(0);
  const pullStart = useRef<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Persist unit preference
  useEffect(() => localStorage.setItem("skycast-unit", unit), [unit]);

  const load = useCallback(async (c: GeoCity, soft = false) => {
    setCity(c);
    if (!soft) setStatus("loading");
    else setRefreshing(true);

    try {
      const b = await fetchWeatherBundle(c);
      setBundle(b);
      setStatus("ready");
      setLastUpdated(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
      // Scroll to top on new city
      if (!soft) window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      if (!soft) setStatus("error");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const useLocation = useCallback((silent = false) => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const c = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
        load(c);
      },
      () => {
        setLocating(false);
        if (!silent) setStatus(s => (s === "idle" ? "idle" : s));
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, [load]);

  // Auto-load last city or geolocation on mount
  useEffect(() => {
    const last = localStorage.getItem("skycast-last-city");
    if (last) {
      try {
        load(JSON.parse(last));
        return;
      } catch { /* fall through */ }
    }
    useLocation(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist last city
  useEffect(() => {
    if (city) localStorage.setItem("skycast-last-city", JSON.stringify(city));
  }, [city]);

  const refresh = useCallback(() => {
    if (city) load(city, true);
  }, [city, load]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const t = setInterval(refresh, 10 * 60 * 1000);
    return () => clearInterval(t);
  }, [refresh]);

  // ──── Pull-to-refresh (mobile touch) ────
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (window.scrollY <= 4) pullStart.current = e.touches[0].clientY;
      else pullStart.current = null;
    };
    const onMove = (e: TouchEvent) => {
      if (pullStart.current == null) return;
      const dy = e.touches[0].clientY - pullStart.current;
      if (dy > 0 && window.scrollY <= 4) setPull(Math.min(dy * 0.4, 85));
    };
    const onEnd = () => {
      if (pull >= 65) refresh();
      setPull(0);
      pullStart.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [pull, refresh]);

  const scene = bundle ? sceneFor(bundle.current.weatherCode, bundle.current.isDay) : "sunny";

  return (
    <div className="min-h-screen flex flex-col">
      <WeatherBackground scene={scene} />

      {/* Pull-to-refresh indicator */}
      <div
        className="pointer-events-none fixed left-1/2 top-3 z-50 transition-all duration-200"
        style={{
          opacity: pull > 8 || refreshing ? 1 : 0,
          transform: `translate(-50%, ${Math.min(pull, 55)}px)`,
        }}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white shadow-xl shadow-blue-100/40">
          {refreshing
            ? <Loader2 size={17} className="animate-spin text-primary" />
            : <ArrowDown size={17} className="text-primary transition-transform duration-200" style={{ transform: pull >= 65 ? "rotate(180deg)" : "none" }} />
          }
        </span>
      </div>

      <Navbar
        unit={unit}
        onUnitChange={setUnit}
        onSelectCity={(c) => load(c)}
        onUseLocation={() => useLocation(false)}
        onRefresh={refresh}
        refreshing={refreshing}
        locating={locating}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl space-y-6 sm:space-y-8 px-3 sm:px-6 pb-6 pt-5 sm:pt-7">
        {/* Last updated badge */}
        {status === "ready" && lastUpdated && (
          <div className="anim-fade-in flex justify-center -mb-3 sm:-mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 border border-line/50 px-3.5 py-1 text-[11px] font-medium text-inkmuted shadow-sm backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Updated {lastUpdated}
              {refreshing && <Loader2 size={11} className="ml-1 animate-spin text-primary" />}
            </span>
          </div>
        )}

        {status === "loading" && <LoadingSkeleton />}
        {status === "error" && <ErrorState onRetry={() => (city ? load(city) : setStatus("idle"))} />}
        {status === "idle" && <EmptyState />}

        {status === "ready" && bundle && (
          <div key={`${bundle.city.latitude.toFixed(4)}-${bundle.city.longitude.toFixed(4)}-${bundle.fetchedAt}`} className="space-y-6 sm:space-y-8">
            <Hero bundle={bundle} unit={unit} />
            <Highlights bundle={bundle} />
            <Hourly bundle={bundle} unit={unit} />

            <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
              <Daily bundle={bundle} unit={unit} />
              <div className="grid gap-5 sm:gap-6 content-start">
                <AirQualityCard bundle={bundle} />
                <AlertsCard bundle={bundle} />
              </div>
            </div>

            <Details bundle={bundle} unit={unit} />
            <MapCard city={bundle.city} />
          </div>
        )}

        <Favorites unit={unit} activeId={bundle?.city.id} onSelect={(c) => load(c)} />
      </main>

      <Footer />
    </div>
  );
}

import { useEffect, useRef, useState, useCallback } from "react";
import { CloudSun, Search, LocateFixed, RefreshCw, MapPin, Loader2, X } from "lucide-react";
import { searchCities, type GeoCity } from "../lib/api";
import type { Unit } from "../lib/weatherUtils";

interface Props {
  unit: Unit;
  onUnitChange: (u: Unit) => void;
  onSelectCity: (c: GeoCity) => void;
  onUseLocation: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  locating: boolean;
}

export default function Navbar({ unit, onUnitChange, onSelectCity, onUseLocation, onRefresh, refreshing, locating }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoCity[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchCities(query);
        setSuggestions(res);
        setOpen(true);
        setHighlight(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 280);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const pick = useCallback((c: GeoCity) => {
    onSelectCity(c);
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    inputRef.current?.blur();
  }, [onSelectCity]);

  const submit = useCallback(async () => {
    if (highlight >= 0 && suggestions[highlight]) return pick(suggestions[highlight]);
    if (suggestions[0]) return pick(suggestions[0]);
    if (query.trim().length >= 2) {
      const res = await searchCities(query);
      if (res[0]) pick(res[0]);
    }
  }, [highlight, suggestions, pick, query]);

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="rounded-b-2xl sm:rounded-b-3xl border border-t-0 border-line bg-navbar/85 backdrop-blur-xl shadow-[0_6px_32px_-10px_rgba(59,130,246,.2)]">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3">
            {/* ── Logo ── */}
            <a href="/" className="flex shrink-0 items-center gap-2 group" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-cloudblue text-white shadow-md shadow-blue-200/50 transition-transform group-hover:scale-105">
                <CloudSun size={20} strokeWidth={2} />
              </span>
              <span className="hidden sm:block text-lg font-extrabold tracking-tight text-ink">
                Sky<span className="gradient-text">Cast</span>
              </span>
            </a>

            {/* ── Search ── */}
            <div ref={boxRef} className="relative mx-auto w-full max-w-lg lg:max-w-xl">
              <div className="flex items-center gap-2 rounded-full border border-line bg-white/90 px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-sm transition-all duration-200 focus-within:border-secondary focus-within:ring-[3px] focus-within:ring-blue-100 focus-within:shadow-md focus-within:shadow-blue-50">
                {searching
                  ? <Loader2 size={17} className="shrink-0 animate-spin text-primary" />
                  : <Search size={17} className="shrink-0 text-inkmuted/60" />}
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); submit(); }
                    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => Math.min(h + 1, suggestions.length - 1)); }
                    if (e.key === "ArrowUp") { e.preventDefault(); setHighlight((h) => Math.max(h - 1, -1)); }
                    if (e.key === "Escape") setOpen(false);
                  }}
                  placeholder="Search any city..."
                  className="w-full bg-transparent text-sm text-ink placeholder-inkmuted/50 outline-none"
                  aria-label="Search city"
                  autoComplete="off"
                />
                {query && (
                  <button onClick={clearSearch} className="shrink-0 rounded-full p-0.5 text-inkmuted/50 hover:text-inkmuted transition" aria-label="Clear search">
                    <X size={15} />
                  </button>
                )}
                <button
                  onClick={submit}
                  className="hidden sm:flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-dark active:scale-95 shadow-sm shadow-blue-200/40"
                >
                  Search
                </button>
              </div>

              {/* ── Suggestion Dropdown ── */}
              {open && suggestions.length > 0 && (
                <ul className="anim-slide-down absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl border border-line bg-white shadow-xl shadow-blue-100/40">
                  {suggestions.map((c, i) => (
                    <li key={`${c.id}-${i}`}>
                      <button
                        onClick={() => pick(c)}
                        onMouseEnter={() => setHighlight(i)}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 sm:py-3 text-left text-sm transition-colors ${
                          i === highlight ? "bg-hoverblue" : "hover:bg-hoverblue/60"
                        }`}
                      >
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-primary shrink-0">
                          <MapPin size={14} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-ink">{c.name}</span>
                          <span className="ml-2 text-xs text-inkmuted truncate">
                            {[c.admin1, c.country].filter(Boolean).join(", ")}
                          </span>
                        </div>
                        {c.countryCode && (
                          <span className="shrink-0 text-[10px] font-bold text-inkmuted/60 bg-surface rounded px-1.5 py-0.5">
                            {c.countryCode}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── Action Buttons ── */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
              {/* Current Location */}
              <button
                onClick={onUseLocation}
                title="Use current location"
                className="tooltip grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-line bg-white/80 text-primary transition hover:bg-hoverblue hover:border-secondary active:scale-95"
                data-tip="My Location"
              >
                {locating ? <Loader2 size={17} className="animate-spin" /> : <LocateFixed size={17} />}
              </button>

              {/* Unit Toggle */}
              <div className="flex items-center rounded-full border border-line bg-white/80 p-0.5 sm:p-1 text-xs font-bold">
                {(["c", "f"] as Unit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => onUnitChange(u)}
                    className={`rounded-full px-2 py-1 sm:px-2.5 sm:py-1.5 transition-all ${
                      unit === u
                        ? "bg-primary text-white shadow-sm shadow-blue-200/50"
                        : "text-inkmuted hover:text-primary"
                    }`}
                    aria-pressed={unit === u}
                  >
                    °{u.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Refresh */}
              <button
                onClick={onRefresh}
                title="Refresh weather data"
                className="tooltip grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-line bg-white/80 text-primary transition hover:bg-hoverblue hover:border-secondary active:scale-95"
                data-tip="Refresh"
              >
                <RefreshCw size={17} className={`transition-transform ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

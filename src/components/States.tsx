import { CloudSun, CloudOff, Search, MapPin } from "lucide-react";

// ═════════════════════════════════════════════════════════
// Loading Skeleton
// ═════════════════════════════════════════════════════════
export function LoadingSkeleton() {
  return (
    <div className="anim-fade-in space-y-6 sm:space-y-8" aria-busy>
      {/* Hero skeleton */}
      <div className="card-glass p-5 sm:p-7">
        <div className="flex items-center gap-2 mb-5">
          <div className="skeleton h-7 w-32 rounded-full" />
          <div className="skeleton h-5 w-24 rounded-full" />
        </div>
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="skeleton h-[88px] w-[88px] rounded-3xl shrink-0" />
          <div className="space-y-3">
            <div className="skeleton h-20 w-52" />
            <div className="skeleton h-5 w-36" />
            <div className="skeleton h-4 w-28" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      </div>

      {/* Highlights skeleton */}
      <div>
        <div className="skeleton h-6 w-44 mb-4" />
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-36 rounded-[1.25rem]" />)}
        </div>
      </div>

      {/* Hourly skeleton */}
      <div>
        <div className="skeleton h-6 w-40 mb-4" />
        <div className="flex gap-2.5 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton h-[160px] w-[108px] shrink-0 rounded-[1.25rem]" />
          ))}
        </div>
      </div>

      {/* Daily + Air skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="skeleton h-[340px] rounded-[1.25rem]" />
        <div className="space-y-4">
          <div className="skeleton h-[200px] rounded-[1.25rem]" />
          <div className="skeleton h-[120px] rounded-[1.25rem]" />
        </div>
      </div>

      {/* Details skeleton */}
      <div>
        <div className="skeleton h-6 w-44 mb-4" />
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-[1.25rem]" />)}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// Empty State
// ═════════════════════════════════════════════════════════
export function EmptyState() {
  return (
    <div className="anim-fade-up card-glass flex flex-col items-center px-6 py-16 sm:py-20 lg:py-24 text-center">
      <div className="relative">
        <div className="floaty grid h-32 w-32 sm:h-36 sm:w-36 place-items-center rounded-full bg-gradient-to-br from-hoverblue via-skyblue/30 to-blue-100 shadow-xl shadow-blue-100/30">
          <CloudSun size={64} className="text-primary" strokeWidth={1.3} />
        </div>
        <span className="absolute -bottom-1 -right-1 grid h-11 w-11 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-blue-200/50">
          <Search size={18} />
        </span>
      </div>

      <h2 className="mt-8 text-2xl font-extrabold text-ink">Welcome to SkyCast</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-inkmuted">
        Search for a city to view the latest weather forecast, hourly predictions, air quality, and more.
      </p>

      {/* Quick suggest */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-inkmuted mr-1">Try:</span>
        {["New York", "London", "Tokyo", "Chennai"].map(city => (
          <span key={city} className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-hoverblue rounded-full px-3 py-1.5 border border-line/50 cursor-default">
            <MapPin size={10} /> {city}
          </span>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// Error State
// ═════════════════════════════════════════════════════════
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="anim-fade-up card flex flex-col items-center px-6 py-16 sm:py-20 lg:py-24 text-center">
      <div className="relative">
        <div className="floaty grid h-32 w-32 place-items-center rounded-full bg-red-50 shadow-xl shadow-red-100/20">
          <CloudOff size={64} className="text-red-300" strokeWidth={1.3} />
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-extrabold text-ink">Oops! We couldn't find that city.</h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-inkmuted">
        Try another location, check your spelling, or verify your internet connection.
      </p>
      <button
        onClick={onRetry}
        className="ripple-btn mt-8 rounded-full bg-gradient-to-r from-primary to-secondary px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200/40 transition hover:shadow-xl hover:shadow-blue-200/50 active:scale-95"
      >
        Try Again
      </button>
    </div>
  );
}

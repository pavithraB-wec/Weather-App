import { CloudSun, Code2, Mail, Globe, Database, Info, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-navbar/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-cloudblue text-white shadow-md shadow-blue-200/50">
                <CloudSun size={20} />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-ink">
                Sky<span className="gradient-text">Cast</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-inkmuted">
              A fast, elegant weather platform delivering real-time conditions, hourly &amp; 7-day forecasts,
              air quality monitoring, and severe weather alerts for any location worldwide. Built with care for a delightful experience.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs text-inkmuted">
              <span>Made with</span>
              <Heart size={11} className="text-red-400 fill-red-400" />
              <span>for weather enthusiasts</span>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-ink mb-4">Resources</h3>
            <ul className="space-y-2.5 text-sm text-inkmuted">
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-2 transition hover:text-primary group">
                  <Info size={14} className="text-secondary group-hover:text-primary" /> About SkyCast
                </a>
              </li>
              <li>
                <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-primary group">
                  <Database size={14} className="text-secondary group-hover:text-primary" /> API — Open-Meteo
                </a>
              </li>
              <li>
                <a href="https://www.windy.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-primary group">
                  <Globe size={14} className="text-secondary group-hover:text-primary" /> Maps — Windy
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-bold text-ink mb-4">Connect</h3>
            <ul className="space-y-2.5 text-sm text-inkmuted">
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-2 transition hover:text-primary group">
                  <Code2 size={14} className="text-secondary group-hover:text-primary" /> GitHub
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-2 transition hover:text-primary group">
                  <Mail size={14} className="text-secondary group-hover:text-primary" /> Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-[11px] text-inkmuted sm:flex-row">
          <p>© {new Date().getFullYear()} SkyCast Weather. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Real-time data</span>
            <span className="w-px h-3 bg-line" />
            <span>No account required</span>
            <span className="w-px h-3 bg-line" />
            <span>Built for speed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

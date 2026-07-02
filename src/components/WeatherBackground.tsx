import { useMemo } from "react";
import type { Scene } from "../lib/weatherUtils";

export default function WeatherBackground({ scene }: { scene: Scene }) {
  const rain = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: `${(i * 31 + 7) % 100}%`,
        height: 40 + ((i * 17) % 45),
        duration: 0.7 + ((i * 7) % 12) / 16,
        delay: -((i * 13) % 22) / 10,
      })),
    []
  );
  const snow = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        left: `${(i * 43 + 5) % 100}%`,
        size: 3 + ((i * 7) % 7),
        duration: 5 + ((i * 4) % 7),
        delay: -((i * 11) % 55) / 10,
      })),
    []
  );
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        left: `${(i * 47 + 13) % 100}%`,
        top: `${(i * 23) % 50}%`,
        size: 1 + ((i * 7) % 4),
        duration: 2 + ((i * 5) % 6),
        delay: ((i * 7) % 40) / 10,
      })),
    []
  );

  const gradient: Record<Scene, string> = {
    sunny:  "linear-gradient(175deg, #DBEFFE 0%, #EDF6FF 30%, #F5FBFF 60%, #F5FBFF 100%)",
    cloudy: "linear-gradient(175deg, #E0ECF7 0%, #EAF3FC 35%, #F5FBFF 65%, #F5FBFF 100%)",
    rain:   "linear-gradient(175deg, #D4E3F3 0%, #E3EFF9 35%, #F2F8FE 65%, #F5FBFF 100%)",
    storm:  "linear-gradient(175deg, #C8D9ED 0%, #DCE9F5 35%, #EFF6FC 65%, #F5FBFF 100%)",
    snow:   "linear-gradient(175deg, #E8F2FB 0%, #F2F8FF 35%, #F7FCFF 65%, #F5FBFF 100%)",
    fog:    "linear-gradient(175deg, #E5ECF3 0%, #EDF3F9 35%, #F5FBFF 65%, #F5FBFF 100%)",
    night:  "linear-gradient(175deg, #D4DEF0 0%, #E4ECF8 35%, #F0F5FC 65%, #F5FBFF 100%)",
  };

  const showClouds = scene === "cloudy" || scene === "rain" || scene === "storm" || scene === "fog";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ background: gradient[scene] }} aria-hidden>
      {/* Sunny — warm radial glow */}
      {scene === "sunny" && (
        <>
          <div className="sun-glow absolute -top-28 -right-28 h-[420px] w-[420px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(253,224,71,.35) 0%, rgba(253,224,71,0) 65%)" }} />
          <div className="absolute top-12 right-14 h-28 w-28 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(251,191,36,.45) 0%, rgba(251,191,36,0) 68%)" }} />
        </>
      )}

      {/* Night — moon & stars */}
      {scene === "night" && (
        <>
          <div className="absolute top-16 right-20 h-20 w-20 rounded-full"
            style={{
              background: "radial-gradient(circle at 38% 38%, #FEF9C3, #E0E7FF 65%)",
              boxShadow: "0 0 70px 22px rgba(199,210,254,.6)"
            }} />
          {stars.map((s, i) => (
            <span key={i} className="star" style={{
              left: s.left, top: s.top, width: s.size, height: s.size,
              animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`,
            }} />
          ))}
        </>
      )}

      {/* Drifting clouds */}
      {(showClouds || scene === "snow" || scene === "sunny") && (
        <>
          <CloudBlob top="5%" scale={1.15} duration={100} delay={-25} opacity={showClouds ? 0.85 : 0.4} />
          <CloudBlob top="14%" scale={0.7} duration={130} delay={-75} opacity={showClouds ? 0.7 : 0.3} />
          <CloudBlob top="25%" scale={0.95} duration={150} delay={-5}  opacity={showClouds ? 0.55 : 0.25} />
        </>
      )}

      {/* Rain */}
      {(scene === "rain" || scene === "storm") &&
        rain.map((r, i) => (
          <span key={i} className="raindrop" style={{
            left: r.left, height: r.height,
            animationDuration: `${r.duration}s`, animationDelay: `${r.delay}s`,
          }} />
        ))}

      {/* Snow */}
      {scene === "snow" &&
        snow.map((s, i) => (
          <span key={i} className="snowflake" style={{
            left: s.left, width: s.size, height: s.size,
            animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`,
          }} />
        ))}

      {/* Lightning */}
      {scene === "storm" && <div className="lightning" />}

      {/* Fog layers */}
      {scene === "fog" && (
        <>
          <div className="absolute inset-x-0 top-[22%] h-36 blur-[40px]" style={{ background: "rgba(226,232,240,.6)" }} />
          <div className="absolute inset-x-0 top-[48%] h-44 blur-[50px]" style={{ background: "rgba(203,213,225,.4)" }} />
          <div className="absolute inset-x-0 top-[72%] h-32 blur-[35px]" style={{ background: "rgba(226,232,240,.35)" }} />
        </>
      )}
    </div>
  );
}

function CloudBlob({ top, scale, duration, delay, opacity }: {
  top: string; scale: number; duration: number; delay: number; opacity: number;
}) {
  return (
    <div className="cloud" style={{ top, animationDuration: `${duration}s`, animationDelay: `${delay}s`, opacity }}>
      <svg width={240 * scale} height={90 * scale} viewBox="0 0 240 90" fill="none">
        <ellipse cx="65" cy="56" rx="54" ry="28" fill="white" fillOpacity=".9" />
        <ellipse cx="130" cy="42" rx="62" ry="34" fill="white" fillOpacity=".95" />
        <ellipse cx="185" cy="58" rx="48" ry="24" fill="white" fillOpacity=".85" />
      </svg>
    </div>
  );
}

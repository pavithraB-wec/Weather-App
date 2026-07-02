import {
  Sun, Moon, CloudSun, CloudMoon, Cloud, Cloudy, CloudFog,
  CloudDrizzle, CloudRain, CloudRainWind, CloudSnow, CloudHail, CloudLightning,
} from "lucide-react";
import type { IconKey } from "../lib/weatherUtils";

const MAP: Record<IconKey, { Icon: any; color: string; glow: string }> = {
  "sun":        { Icon: Sun,            color: "#F59E0B", glow: "rgba(245,158,11,.15)" },
  "moon":       { Icon: Moon,           color: "#818CF8", glow: "rgba(129,140,248,.15)" },
  "cloud-sun":  { Icon: CloudSun,       color: "#60A5FA", glow: "rgba(96,165,250,.12)" },
  "cloud-moon": { Icon: CloudMoon,      color: "#818CF8", glow: "rgba(129,140,248,.12)" },
  "cloud":      { Icon: Cloud,          color: "#7DD3FC", glow: "rgba(125,211,252,.12)" },
  "clouds":     { Icon: Cloudy,         color: "#94A3B8", glow: "rgba(148,163,184,.1)" },
  "fog":        { Icon: CloudFog,       color: "#94A3B8", glow: "rgba(148,163,184,.1)" },
  "drizzle":    { Icon: CloudDrizzle,   color: "#60A5FA", glow: "rgba(96,165,250,.12)" },
  "rain":       { Icon: CloudRain,      color: "#3B82F6", glow: "rgba(59,130,246,.12)" },
  "heavy-rain": { Icon: CloudRainWind,  color: "#2563EB", glow: "rgba(37,99,235,.12)" },
  "snow":       { Icon: CloudSnow,      color: "#7DD3FC", glow: "rgba(125,211,252,.15)" },
  "sleet":      { Icon: CloudHail,      color: "#60A5FA", glow: "rgba(96,165,250,.12)" },
  "storm":      { Icon: CloudLightning, color: "#F59E0B", glow: "rgba(245,158,11,.15)" },
};

export default function WeatherIcon({
  icon,
  size = 24,
  className = "",
  strokeWidth = 1.7,
  withGlow = false,
}: {
  icon: IconKey;
  size?: number;
  className?: string;
  strokeWidth?: number;
  withGlow?: boolean;
}) {
  const { Icon, color, glow } = MAP[icon] ?? MAP["cloud"];
  if (withGlow) {
    return (
      <span className="relative inline-flex items-center justify-center">
        <span
          className="absolute rounded-full"
          style={{
            width: size * 1.8,
            height: size * 1.8,
            background: `radial-gradient(circle, ${glow}, transparent 70%)`,
          }}
        />
        <Icon size={size} strokeWidth={strokeWidth} color={color} className={`relative ${className}`} aria-hidden />
      </span>
    );
  }
  return <Icon size={size} strokeWidth={strokeWidth} color={color} className={className} aria-hidden />;
}

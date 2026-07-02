# Skycast Weather App

A modern React + Vite weather dashboard with local unit preference, location support, weather highlights, hourly and daily forecasts, air quality, alerts, and a map display.

## Features

- React 19 + Vite powered UI
- Tailwind CSS for styling
- Weather search and favorites support
- Device geolocation for current weather
- Pull-to-refresh support on mobile
- Dark/light weather scenes and animated background
- Air quality and alerts cards
- Persisted unit preference and last selected city

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Lucide icons
- `vite-plugin-singlefile`

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the app at `http://localhost:5173/`.

## Build

```bash
npm run build
```

## Notes

- The app stores preferences in `localStorage`.
- Geolocation is used when available.
- The project uses alias `@/*` for imports from `src`.

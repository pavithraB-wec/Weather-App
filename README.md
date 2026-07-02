<img width="1240" height="2647" alt="WA-2" src="https://github.com/user-attachments/assets/bd78cb25-fac2-4bbb-b790-73ab03b86f95" />

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

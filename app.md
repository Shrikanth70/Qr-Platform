# QR Code Generator & Verifier App

## Overview

This is a modern web application built with **React** and **Vite**, designed for generating and verifying QR codes with customizable patterns and options. The app features a sleek user interface with video backgrounds and interactive components, likely aimed at creative or advanced QR code usage (e.g., artistic patterns).

## Key Features

- **QR Code Generation**: Users can create QR codes with various pattern options.
- **QR Code Verification**: Scan and validate generated QR codes.
- **Customizable Options**: Select different patterns and styles via OptionCard and PatternCard components.
- **Real-time Preview**: Live QR preview during generation.
- **Responsive Design**: Navbar for navigation between pages, optimized for desktop/mobile.

## Project Structure

```
frontend/
├── public/          # Static assets (favicon, icons)
├── src/
│   ├── assets/      # Media files (videos: loop.mp4, hero videos; images: hero.png, logos)
│   ├── components/
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── OptionCard.jsx   # Option selection cards
│   │   ├── PatternCard.jsx  # Pattern customization cards
│   │   ├── QrPreview.jsx    # QR code preview component (note: listed as QRPreview in tabs)
│   │   └── VerifyResult.jsx # Verification results display
│   ├── pages/
│   │   ├── Home.jsx         # Landing/home page
│   │   ├── Generate.jsx     # QR generation page
│   │   └── Verify.jsx       # QR verification page
│   ├── App.jsx              # Main App component & routing
│   ├── App.css              # Global styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Base CSS
├── package.json       # Dependencies (React, Vite, ESLint)
├── vite.config.js     # Vite configuration
├── TODO.md            # Pending tasks (in progress)
├── README.md          # Standard Vite setup docs
└── .gitignore         # Git ignores
```

## Tech Stack

- **Frontend**: React (with JSX), Vite (fast dev server & builds)
- **Styling**: CSS (App.css, index.css) – potentially Tailwind or custom
- **Linting**: ESLint (eslint.config.js)
- **Assets**: High-res videos for hero sections (e.g., abstract loops, sci-fi themes), SVG icons
- **Build Tools**: Vite plugins for React (Oxc or SWC)

## Pages & User Flow

1. **Home (/ or /home)**: Introduction with hero video/section.
2. **Generate (/generate)**: Input data, select patterns/options, preview QR.
3. **Verify (/verify)**: Upload/scan QR, show verification result.

## Assets Highlights

- Background videos for immersive UI (e.g., looping abstract animations, Marvel-inspired visuals).
- Optimized images and SVGs for logos/previews.

## Development Status

- Core components implemented.
- TODO.md likely tracks remaining features (e.g., QR library integration like qrcode.react, camera scan for verify).
- Ready for `npm install && npm run dev` – opens at http://localhost:5173.

## Running the App

```bash
cd frontend
npm install
npm run dev
```

## Future Enhancements (Inferred)

- Integrate QR generation library (e.g., QRCode.js or react-qr-code).
- Camera access for mobile verification.
- Export/share QR as image/PDF.
- More patterns/themes.
- Backend for secure verification.

This project showcases a polished, media-rich React app focused on QR interactivity.

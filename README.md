# Quick Connect 

A modern, high-performance web application designed for generating customized artistic QR codes and rigorously verifying them via a Python FastAPI backend equipped with advanced optical character recognition heuristics.

## 🚀 Overview

This platform is divided into a **React + Vite** frontend providing a seamless, glass-morphism UI with real-time SVG rendering, and a **FastAPI** backend that acts as an unyielding verification gateway. It goes beyond standard QR tools by allowing profound aesthetic customization (padding, colors, shapes, internal logos) while mathematically ensuring the output remains perfectly scannable by manipulating backend morphological array logic.

## ✨ Key Features

### Frontend (React / Vite / Tailwind)
- **Live SVG Rendering Component**: Modify QR parameters (Size, Padding, Logo, Colors, Styles) in absolute real-time.
- **Client-Side Rasterization Pipeline**: The `<canvas>` engine mathematically standardizes the custom SVG vectors and automatically injects an ISO-compliant 8% Quiet Zone border to guarantee scanner adherence.
- **Premium Aesthetics**: Fully hardware-accelerated background looping (`loop.mp4`) with mathematically calibrated translucent glass-morphism overlays and text anti-aliasing.
- **Modern Options**: Output in `PNG` or `JPG`, toggle various structural matrix styles (`Classic`, `Rounded`, `Bold`, `Minimal`).

### Backend Verification (FastAPI / OpenCV / Pyzbar)
- **Aggressive Optical Morphology**: The `/verify` route dynamically assesses uploaded QR images. 
- **Inverted Polarity Parsing**: Utilizes `cv2.bitwise_not()` arrays to instantly detect and decode dark-background "Inverted" QR codes.
- **Infinite Padding Emulation**: Processes tightly cropped user uploads using `cv2.copyMakeBorder(..., BORDER_REPLICATE)`, synthesizing an artificial Quiet Zone boundary for the scanner if the user uploaded an unpadded crop.
- **Dual-Thresholding Matrix**: Evaluates varying levels of Gaussian Blur paired with `cv2.THRESH_OTSU` to mathematically force disconnected dots or overlapping blobs to align into standardized bounding boxes recognized by Pyzbar.

## 📂 Project Structure

```text
/
├── frontend/          # React + Vite Client
│   ├── public/        # Static assets (loop.mp4, etc)
│   ├── src/           
│   │   ├── api/       # Axios API bindings
│   │   ├── components/# Reusable UI Components (QRPreview, Navbar)
│   │   └── pages/     # Stateful Views (Home, Generate, Verify)
│   └── package.json   
│
├── backend/           # FastAPI Verification Engine
│   ├── api/           # verification routes (verify.py)
│   ├── main.py        # ASGI server config
│   └── requirements.txt
│
└── README.md          # You are here!
```

## 🛠️ Tech Stack

- **Client**: ReactJS, Vite, TailwindCSS, React-Router-DOM
- **Server**: Python 3.10+, FastAPI, Uvicorn
- **Engines**: OpenCV (`cv2`), `pyzbar`, NumPy, Pillow (`PIL`)
- **Code Styling**: Prettier, ESLint

## 💻 Running Locally

### 1. Start the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (or `venv\Scripts\activate` on Windows)
pip install -r requirements.txt
python main.py
```
> The FastAPI backend will boot on `http://127.0.0.1:8000`

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
> The Vite frontend will boot on `http://localhost:5173`

*(Ensure `frontend/.env` is routed properly to the backend port if required).*

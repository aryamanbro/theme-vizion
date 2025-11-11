# FinSent Dashboard — Real-Time Financial Sentiment Analysis

FinSent Dashboard is a modern, high-performance web application that provides **real-time financial market insights enhanced with sentiment intelligence**. It unifies live market data, social sentiment analysis, and Google Trends interest into a single, powerful analytics dashboard built for speed and clarity.

---

## Features

### 1. Advanced Financial Data & Visualization

- **Live Price Tickers:** Real-time stock and crypto prices streamed for immediate tracking.
- **Composed Multi-Layer Chart:** Interactive Recharts visualization combining:
  - Price Action (Area/Line)
  - User Sentiment (Bar)
  - Google Trends Interest (Line)
- **Categorized Sentiment News:** Auto-curated positive and negative news feed relevant to the selected symbol.

---

### 2. Cutting-Edge User Experience

- **Dynamic Multi-Theme Support:**  
  Themes include: light, dark-blue, dark-sunset, dark-ocean, dark-forest, dark-twilight.  
  Powered by `next-themes` + custom Tailwind variants.

- **Enhanced Cold Start Loading Screen:**  
  Includes:
  - Real-time backend handshake polling
  - Mini-games (Market Prediction, Price Guess)
  - Simulated loading progress bar
  - Debug mode to manually trigger loading screen
  - Button to enter/exit loading screen anytime

- **Fast Navigation & UI:** Powered by Vite for low-latency rendering and instant HMR.

---

### 3. Admin System Management

- **Admin Symbol Onboarding:**  
  Add new Stock or Crypto symbols through an admin-protected interface. Requires admin password.

---

## Tech Stack

| Component | Technology | Version | Description |
|----------|------------|---------|-------------|
| Frontend | React | 18.3.1 | Core framework |
| Language | TypeScript | 5.8.3 | Type safety & tooling |
| Styling | Tailwind CSS | 3.4.17 | Utility-first CSS |
| Build Tool | Vite | 5.4.19 | Fast bundler + dev server |
| State Management | @tanstack/react-query | 5.83.0 | Optimized server-state handling |
| Charts | Recharts | 2.15.4 | Declarative charting |
| Routing | react-router-dom | 6.30.1 | Client-side routing |
| Forms | react-hook-form + Zod | 7.61.1 + 3.25.76 | Form handling + validation |

---

## Project Structure

src/
│── components/ # UI components, layout, loading screens
│── hooks/ # Custom hooks for API, polling, games
│── pages/ # Page-level routes (Dashboard, Admin, Loading)
│── context/ # Theme and global providers
│── utils/ # Formatters, helpers, API utilities
│── assets/ # Icons, images
│── config/ # App-wide config & environment
│── styles/ # Tailwind custom themes

yaml
Copy code

---

## Getting Started

### Prerequisites

- Node.js **>= 18** (recommended: >= 20)

---

### Installation

```bash
git clone <repository-url>
cd theme-vizion
npm install
Run Locally
bash
Copy code
npm run dev
The app will start with Hot Module Replacement enabled.

Default backend endpoint:

cpp
Copy code
http://127.0.0.1:8000
To override:

ini
Copy code
VITE_API_URL=<your_backend_url>
Build for Production
bash
Copy code
npm run build
Output is generated in the /dist folder.
Supports SPA routing with Vercel rewrites.


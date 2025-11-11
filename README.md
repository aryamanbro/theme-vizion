


# FinSent Dashboard — Real-Time Financial Sentiment Analysis

FinSent Dashboard is a high-performance, modern web application that provides **real-time financial market insights enhanced with sentiment intelligence**. It unifies live market data, social sentiment analysis, and Google Trends interest into a single, powerful analytics dashboard built for speed, clarity, and interactivity.

---

## Features

### 1. Advanced Financial Data & Visualization

* **Live Price Tickers** — Real-time stock and crypto price streaming for instant tracking.
* **Composed Multi-Layer Chart** using Recharts:

  * Price Action (Area/Line)
  * User Sentiment (Bar)
  * Google Trends Interest (Line)
* **Categorized Sentiment News** — Auto-curated positive and negative news feeds relevant to the selected symbol.

---

### 2. Cutting-Edge User Experience

* **Dynamic Multi-Theme Interface**
  Includes: light, dark-blue, dark-sunset, dark-ocean, dark-forest, dark-twilight.
  Powered by `next-themes` and custom Tailwind CSS variants.

* **Enhanced Cold-Start Loading Experience**
  Smooth experience even when backend is waking up:

  * Real-time backend handshake polling
  * Interactive mini-games (Market Prediction, Price Guess)
  * Simulated progress bar
  * Developer debug mode to manually test loading screen
  * Button to enter/exit loading screen anytime, even after app is loaded

* **Optimized for Speed**
  Powered by Vite for ultra-fast bundling, reduced latency, and instant HMR updates.

---

### 3. Admin System Management

* **Symbol Onboarding System**
  Admin interface to add new stock or crypto symbols securely.
  Protected by admin password.

---

## Tech Stack

| Component        | Technology            | Version          | Description                     |
| ---------------- | --------------------- | ---------------- | ------------------------------- |
| Frontend         | React                 | 18.3.1           | Core UI framework               |
| Language         | TypeScript            | 5.8.3            | Strong typing, tooling          |
| Styling          | Tailwind CSS          | 3.4.17           | Utility-first styling           |
| Build Tool       | Vite                  | 5.4.19           | Fast dev/build system           |
| State Management | @tanstack/react-query | 5.83.0           | Optimized server-state handling |
| Charting         | Recharts              | 2.15.4           | Declarative charting            |
| Routing          | react-router-dom      | 6.30.1           | Client-side navigation          |
| Forms            | react-hook-form + Zod | 7.61.1 + 3.25.76 | Form validation & handling      |

---

## Project Structure

```
src/
│── components/       # Reusable UI and loading screen components
│── hooks/            # API polling, mini-games, backend handshake logic
│── pages/            # Dashboard, Admin Panel, Loading Screen
│── context/          # Theme + global providers
│── utils/            # Formatters, helpers, API utilities
│── assets/           # Icons, fonts, images
│── config/           # Environment configuration
│── styles/           # Tailwind custom themes and overrides
```

---

## Getting Started

### Prerequisites

* Node.js **18 or above** (recommended: 20)

---

### Installation

Clone the repository:

```
git clone <repository-url>
cd theme-vizion
```

Install dependencies:

```
npm install
```

---

### Run Locally

Start the development server:

```
npm run dev
```

The app will run with HMR (Hot Module Replacement).

Default backend URL:

```
http://127.0.0.1:8000
```

Override using environment variable:

```
VITE_API_URL=<your_backend_url>
```

---

## Build for Production

Build optimized assets:

```
npm run build
```

This produces the production build in the `/dist` folder.
SPA routing is pre-configured via Vercel rewrites.

---



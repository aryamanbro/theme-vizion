FinSent Dashboard: Real-time Financial Sentiment Analysis
FinSent Dashboard is a high-performance, modern web application designed to provide real-time financial market insights fused with sentiment data. Built for speed and a superior user experience, it visualizes complex market trends, social media sentiment, and Google Trends interest in a single, beautiful dashboard.

🌟 Key Features
1. Advanced Financial Data & Visualization
Live Price Monitoring: Real-time tickers for stocks and crypto, enabling immediate tracking of key assets.

Composed Charting: Utilizes Recharts for an interactive main chart that combines price action (Area/Line), user sentiment (Bar), and Google Trends data for multi-layered analysis.

Intelligent News Feeds: Separate, categorized feeds display positive and negative news articles relevant to the selected symbol, curated to influence market sentiment.

2. Cutting-Edge User Experience
Themed Aesthetics: Offers a dynamic, multi-theme UI system (including light, dark-blue, dark-sunset, dark-ocean, dark-forest, and dark-twilight) powered by next-themes and custom Tailwind CSS variants for deep personalization.

Enhanced Cold Start UX: Addresses backend cold-start delays with an interactive loading screen:

Real-time Handshake: Actively polls the backend until it's awake, ensuring instant transition once connected.

Engaging Mini-Games: Users can play interactive games like Market Prediction and Price Guess while the system warms up, with a button to cycle between them.

Simulated Progress: A smooth, simulated loading bar provides constant visual feedback.

Developer Debug Mode: Includes a function to manually trigger the loading experience for reliable UI testing.

3. System Management
Symbol Onboarding: An Admin interface allows authorized users to quickly add new Stock or Crypto symbols to the system (requires Admin Password).

💻 Tech Stack Overview
Component	Technology	Role & Version
Frontend	React	v18.3.1 (Core Library)
Language	TypeScript	v5.8.3
Styling	Tailwind CSS	v3.4.17 (Utility Framework)
Build Tool	Vite	v5.4.19 (Fast Build & Dev Server)
State Mgt	@tanstack/react-query	v5.83.0 (Server State Management)
Charting	Recharts	v2.15.4 (Declarative Chart Library)
Routing	react-router-dom	v6.30.1
Form	react-hook-form/Zod	v7.61.1 & v3.25.76 (Form Handling & Validation)

Export to Sheets

🚀 Getting Started
Follow these steps to set up and run the project locally.

Prerequisites
Ensure you have Node.js (>=18.0.0 or >=20.0.0 for Vite, see) installed on your system.

Installation
Clone the repository:

Bash

git clone <repository-url>
cd theme-vizion
Install dependencies:

Bash

npm install
Local Development
Start the development server: The server will run with HMR enabled, accessible locally at the default host/port defined in vite.config.ts.

Bash

npm run dev
Note: The frontend is configured to call a backend API expected at http://127.0.0.1:8000. Ensure your backend is running, or update the VITE_API_URL environment variable if needed.

Build and Deployment
To prepare the application for production deployment:

Bash

npm run build
This command bundles the application for production, optimizing performance and outputting files to the /dist directory. The deployment is pre-configured with a Vercel rewrite rule directing all traffic to index.html.
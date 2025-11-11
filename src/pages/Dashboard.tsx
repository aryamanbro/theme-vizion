import { useState, useEffect } from "react";
import axios from "axios";
import { MainDashboardContent } from "@/components/dashboard/MainDashboardContent";
import { LoadingView } from "@/components/dashboard/LoadingView";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const PING_ENDPOINT = `${API_URL}/ping`;
const POLLING_INTERVAL = 1500; // 1.5 seconds
const MAX_ATTEMPTS = 8; // Max attempts for progress to reach 100%

const DashboardWrapper = () => {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  // Track the symbol even in the wrapper, so we can pass it to LoadingView
  const [selectedSymbol, setSelectedSymbol] = useState("TSLA"); 

  const isInitialLoading = !isBackendReady && !debugMode;

  const progress = debugMode
    ? 80 // Lock progress bar at 80% in debug mode
    : Math.min(100, attemptCount * (100 / MAX_ATTEMPTS));

  // --- Polling Logic ---
  useEffect(() => {
    // Stop polling if already ready or in debug mode
    if (isBackendReady || debugMode) {
      return;
    }

    const pollBackend = async () => {
      try {
        await axios.get(PING_ENDPOINT, { timeout: 1000 });
        // Success: Backend is awake
        setIsBackendReady(true);
      } catch (error) {
        // Failure: Backend is still sleeping or unavailable
        setAttemptCount((prev) => prev + 1);
        // Continue polling...
      }
    };

    // Start polling immediately
    pollBackend();

    // Set interval for subsequent polls
    const intervalId = setInterval(pollBackend, POLLING_INTERVAL);

    // Cleanup interval on component unmount or state change
    return () => clearInterval(intervalId);
  }, [isBackendReady, debugMode]);

  if (isInitialLoading || debugMode) {
    return (
      <LoadingView
        progress={progress}
        debugMode={debugMode}
        onExitDebugMode={() => setDebugMode(false)}
        currentSymbol={selectedSymbol} // Pass current symbol to the loading view
      />
    );
  }

  // Once ready, render the full dashboard content
  return (
    <MainDashboardContent 
      onEnterDebugMode={() => setDebugMode(true)} 
      selectedSymbol={selectedSymbol}
      setSelectedSymbol={setSelectedSymbol}
    />
  );
};

export default DashboardWrapper;
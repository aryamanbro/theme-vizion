import * as React from "react";

const MOBILE_BREAKPOINT = 768;

// Helper function to get the value
const getIsMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

export function useIsMobile() {
  // Initialize state directly with the function's result
  const [isMobile, setIsMobile] = React.useState(getIsMobile);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Use the same helper function in the change handler
    const onChange = () => {
      setIsMobile(getIsMobile());
    };

    mql.addEventListener("change", onChange);
    
    // Re-check on mount in case window was resized while component was unmounted
    onChange();

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile; // This is now guaranteed to be a boolean
}
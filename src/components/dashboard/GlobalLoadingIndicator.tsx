import { useIsFetching } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress"; // 1. We must import Progress

export const GlobalLoadingIndicator = () => {
  const isFetching = useIsFetching();
  const show = isFetching > 0;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full z-[100] h-[2px]", // Positioned at the top
        "transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0" // Fade in/out
      )}
      style={{ pointerEvents: "none" }} // Makes it non-interactive
    >
      {/* 2. Use the indeterminate Progress component */}
      <Progress value={show ? 100 : 0} className="h-full w-full" />
    </div>
  );
};
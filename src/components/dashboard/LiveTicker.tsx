import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface TickerData {
  symbol: string;
  price: number;
  change: number;
  percent_change: number;
}

const fetchLivePrice = async (symbol: string): Promise<TickerData> => {
  const response = await fetch(`${API_URL}/api/v1/live-price?symbol=${symbol}`);
  if (!response.ok) {
    throw new Error("Failed to fetch live price");
  }
  return response.json();
};

export const LiveTicker = ({ symbol }: { symbol: string }) => {
  // Use react-query to fetch and auto-refetch
  const { data, error, isLoading } = useQuery({
    queryKey: ["livePrice", symbol],
    queryFn: () => fetchLivePrice(symbol),
    refetchInterval: 10000, // 10 seconds
    staleTime: 1000 * 60, // 1 minute
  });

  // We'll keep this state for the flash animation
  const [flashClass, setFlashClass] = useState("");

  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-fade-in-up">
        <Skeleton className="h-5 w-1/3 mb-2" />
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card p-6 animate-fade-in-up">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {symbol}
        </h2>
        <p className="text-destructive mt-4">Error loading ticker data.</p>
      </div>
    );
  }

  const isPositive = data.percent_change >= 0;
  const priceChangeClass = isPositive ? "text-positive" : "text-negative";

  // TODO: You can wire up the flashClass logic here
  // by comparing `data.price` with `previousPrice`
  
  return (
    <div className="glass-card p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {symbol}
        </h2>
        {isPositive ? (
          <TrendingUp className="h-5 w-5 text-positive" />
        ) : (
          <TrendingDown className="h-5 w-5 text-negative" />
        )}
      </div>

      <div className={`text-4xl font-bold mb-2 ${flashClass}`}>
        ${data.price.toFixed(2)}
      </div>

      <div className={`flex items-center gap-2 text-sm font-medium ${priceChangeClass}`}>
        <span>{isPositive ? "+" : ""}{data.change.toFixed(2)}</span>
        <span>({isPositive ? "+" : ""}{data.percent_change.toFixed(2)}%)</span>
      </div>
    </div>
  );
};
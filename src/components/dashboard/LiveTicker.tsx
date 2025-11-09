import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface LiveTickerProps {
  symbol: string;
  // Expected API response shape:
  // { price: number, change: number, changePercent: number }
}

export const LiveTicker = ({ symbol }: LiveTickerProps) => {
  const [data, setData] = useState({
    price: 0,
    change: 0,
    changePercent: 0,
  });
  const [isFlashing, setIsFlashing] = useState(false);
  const [previousPrice, setPreviousPrice] = useState(0);

  // TODO: Replace with actual API call
  useEffect(() => {
    // Mock data update - replace with your API endpoint
    const fetchPrice = () => {
      // Example: fetch(`/api/ticker/${symbol}`)
      //   .then(res => res.json())
      //   .then(data => setData(data))
      
      // Mock data for demonstration
      const mockPrice = 150 + Math.random() * 10;
      const mockChange = mockPrice - (data.price || mockPrice);
      const mockChangePercent = (mockChange / mockPrice) * 100;

      setPreviousPrice(data.price);
      setData({
        price: mockPrice,
        change: mockChange,
        changePercent: mockChangePercent,
      });

      // Trigger flash animation
      if (data.price !== 0) {
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 500);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 3000);
    return () => clearInterval(interval);
  }, [symbol]);

  const isPositive = data.change >= 0;
  const priceChangeClass = isPositive ? "text-positive" : "text-negative";
  const flashClass = isFlashing
    ? isPositive
      ? "animate-flash-positive"
      : "animate-flash-negative"
    : "";

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
        <span>({isPositive ? "+" : ""}{data.changePercent.toFixed(2)}%)</span>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChartDataPoint {
  time: string;
  value: number;
}

interface MainChartProps {
  symbol: string;
  // Expected API response: ChartDataPoint[]
}

export const MainChart = ({ symbol }: MainChartProps) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "1Y">("1W");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    // TODO: Replace with actual API call
    // fetch(`/api/chart/${symbol}?timeframe=${timeframe}`)
    //   .then(res => res.json())
    //   .then(data => setData(data))
    //   .finally(() => setLoading(false))

    // Mock data for demonstration
    const mockData: ChartDataPoint[] = Array.from({ length: 50 }, (_, i) => ({
      time: new Date(Date.now() - (50 - i) * 86400000).toISOString(),
      value: 150 + Math.random() * 20 + Math.sin(i / 5) * 10,
    }));

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  }, [symbol, timeframe]);

  const minValue = Math.min(...data.map(d => d.value));
  const maxValue = Math.max(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getYPosition = (value: number) => {
    return ((maxValue - value) / range) * 100;
  };

  const pathData = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = getYPosition(point.value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const gradientId = `gradient-${symbol}`;

  return (
    <Card className="glass-card p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Price Chart</h2>
        <div className="flex gap-2">
          {(["1D", "1W", "1M", "1Y"] as const).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="transition-smooth"
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative h-80 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">Loading chart...</div>
          </div>
        ) : (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--chart-gradient-start))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--chart-gradient-end))" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            
            {/* Area under the line */}
            <path
              d={`${pathData} L 100 100 L 0 100 Z`}
              fill={`url(#${gradientId})`}
            />
            
            {/* The line itself */}
            <path
              d={pathData}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              className="transition-smooth"
            />
          </svg>
        )}
      </div>

      <div className="flex justify-between mt-4 text-sm text-muted-foreground">
        <span>Low: ${minValue.toFixed(2)}</span>
        <span>High: ${maxValue.toFixed(2)}</span>
      </div>
    </Card>
  );
};

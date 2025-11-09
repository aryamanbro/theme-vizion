import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid, // <--- Add this
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Get the API URL from the environment
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Define the shape of our API data
interface ChartData {
  time: string;
  close: number | null;
  google_score: number | null;
  avg_sentiment: number | null;
}

// Helper to fetch data
const fetchChartData = async (symbol: string): Promise<ChartData[]> => {
  const response = await fetch(`${API_URL}/api/v1/chart-data?symbol=${symbol}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  
  // Format the data for the chart
  return data.data.map((d: ChartData) => ({
    ...d,
    time: new Date(d.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    close: d.close ? parseFloat(d.close.toFixed(2)) : null,
    google_score: d.google_score ? parseFloat(d.google_score.toFixed(2)) : null,
    avg_sentiment: d.avg_sentiment ? parseFloat(d.avg_sentiment.toFixed(2)) : null,
  }));
};

// Define our chart's series, colors, and labels
const chartConfig = {
  close: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
  avg_sentiment: {
    label: "Sentiment",
    color: "hsl(var(--warning))",
  },
  google_score: {
    label: "Google Trends",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export const MainChart = ({ symbol }: { symbol: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["chartData", symbol],
    queryFn: () => fetchChartData(symbol),
  });

  // Calculate domains for Y-axes
  const [priceDomain, trendDomain, sentimentDomain] = useMemo(() => {
    if (!data) return [["auto", "auto"], ["auto", "auto"], ["auto", "auto"]];
    
    const prices = data.map(d => d.close).filter(Boolean) as number[];
    const trends = data.map(d => d.google_score).filter(Boolean) as number[];
    const sentiments = data.map(d => d.avg_sentiment).filter(Boolean) as number[];

    const priceMin = Math.min(...prices);
    const priceMax = Math.max(...prices);
    
    const trendMin = Math.min(...trends);
    const trendMax = Math.max(...trends);
    
    const sentMin = Math.min(...sentiments, -1);
    const sentMax = Math.max(...sentiments, 1);

    return [
      [Math.floor(priceMin * 0.95), Math.ceil(priceMax * 1.05)],
      [Math.floor(trendMin * 0.9), Math.ceil(trendMax * 1.1)],
      [Math.max(-1, sentMin * 1.1), Math.min(1, sentMax * 1.1)]
    ];
  }, [data]);


  if (isLoading) {
    return (
      <Card className="glass-card p-6 animate-fade-in-up">
        <Skeleton className="h-[450px] w-full" />
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="glass-card p-6 animate-fade-in-up">
        <div className="flex h-[450px] w-full items-center justify-center">
          <p className="text-destructive">Error loading chart data.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6 animate-fade-in-up">
      <h2 className="text-xl font-semibold mb-6">Price & Sentiment Analysis: {symbol}</h2>
      
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <ResponsiveContainer>
          <ComposedChart data={data}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            
            <YAxis
              yAxisId="left"
              dataKey="close"
              domain={priceDomain}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
              stroke="hsl(var(--primary))"
            />
            <YAxis
              yAxisId="right"
              dataKey="avg_sentiment"
              domain={sentimentDomain}
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toFixed(1)}
              stroke="hsl(var(--warning))"
            />
            <YAxis
              yAxisId="right-trends"
              dataKey="google_score"
              domain={trendDomain}
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
              stroke="hsl(var(--destructive))"
              hide={true} // Hide axis, as it conflicts with sentiment
            />

            <Tooltip content={<ChartTooltipContent hideIndicator />} />
            
            <Legend content={<ChartLegendContent />} />

            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-close)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-close)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            {/* --- Data Series --- */}
            
            <Area
              dataKey="close"
              type="monotone"
              fill="url(#fillPrice)"
              stroke="var(--color-close)"
              strokeWidth={2}
              yAxisId="left"
              dot={false}
            />
            
            <Line
              dataKey="google_score"
              type="monotone"
              stroke="var(--color-google_score)"
              strokeWidth={2}
              yAxisId="right-trends"
              dot={false}
            />

            <Bar
              dataKey="avg_sentiment"
              yAxisId="right"
              fill="var(--color-avg_sentiment)"
              fillOpacity={0.5}
            />

          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
};
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // Import ToggleGroup
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
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, LineChart } from "lucide-react";

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
const fetchChartData = async (
  symbol: string,
  timeframe: string,
): Promise<ChartData[]> => {
  // Pass the timeframe to the API
  const response = await fetch(
    `${API_URL}/api/v1/chart-data?symbol=${symbol}&timeframe=${timeframe}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  // Format the data for the chart
  const isHourly = timeframe === "1W" || timeframe === "1M";
  return data.data.map((d: ChartData) => ({
    ...d,
    // Format date for X-axis
    time: new Date(d.time).toLocaleDateString(undefined, {
      month: isHourly ? "numeric" : "short",
      day: isHourly ? "numeric" : "numeric",
      hour: isHourly ? "numeric" : undefined,
    }),
    close: d.close ? parseFloat(d.close.toFixed(2)) : null,
    google_score: d.google_score ? parseFloat(d.google_score.toFixed(2)) : null,
    avg_sentiment: d.avg_sentiment
      ? parseFloat(d.avg_sentiment.toFixed(2))
      : null,
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
  // --- New State for Controls ---
  const [timeframe, setTimeframe] = useState("1Y");
  const [chartType, setChartType] = useState<"area" | "line">("area");

  // Fetch data using react-query
  const { data, isLoading, error } = useQuery({
    queryKey: ["chartData", symbol, timeframe], // Add timeframe to the queryKey
    queryFn: () => fetchChartData(symbol, timeframe), // Pass timeframe to the fetch function
  });

  // Calculate domains for Y-axes
  const [priceDomain, trendDomain, sentimentDomain] = useMemo(() => {
    if (!data) return [["auto", "auto"], ["auto", "auto"], ["auto", "auto"]];

    const prices = data.map((d) => d.close).filter(Boolean) as number[];
    const trends = data.map((d) => d.google_score).filter(Boolean) as number[];
    const sentiments = data
      .map((d) => d.avg_sentiment)
      .filter(Boolean) as number[];

    const priceMin = prices.length ? Math.min(...prices) : 0;
    const priceMax = prices.length ? Math.max(...prices) : 100;

    const trendMin = trends.length ? Math.min(...trends) : 0;
    const trendMax = trends.length ? Math.max(...trends) : 100;

    const sentMin = sentiments.length ? Math.min(...sentiments, -1) : -1;
    const sentMax = sentiments.length ? Math.max(...sentiments, 1) : 1;

    return [
      [Math.floor(priceMin * 0.95), Math.ceil(priceMax * 1.05)],
      [Math.floor(trendMin * 0.9), Math.ceil(trendMax * 1.1)],
      [Math.max(-1, sentMin * 1.1), Math.min(1, sentMax * 1.1)],
    ];
  }, [data]);

  const chartTitle = `Analysis: ${symbol} (${timeframe})`;

  if (isLoading) {
    return (
      <Card className="glass-card p-6 animate-fade-in-up">
        <h2 className="text-xl font-semibold mb-6">{chartTitle}</h2>
        <Skeleton className="h-[400px] w-full" />
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="glass-card p-6 animate-fade-in-up">
        <h2 className="text-xl font-semibold mb-6">{chartTitle}</h2>
        <div className="flex h-[400px] w-full items-center justify-center">
          <p className="text-destructive">Error loading chart data.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6 animate-fade-in-up">
      {/* --- HEADER WITH NEW CONTROLS --- */}
      <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold">{chartTitle}</h2>
        <div className="flex flex-wrap gap-2">
          {/* Timeframe Toggle */}
          <ToggleGroup
            type="single"
            value={timeframe}
            onValueChange={(value) => value && setTimeframe(value)}
            size="sm"
          >
            <ToggleGroupItem value="1W">1W</ToggleGroupItem>
            <ToggleGroupItem value="1M">1M</ToggleGroupItem>
            <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
            <ToggleGroupItem value="ALL">All</ToggleGroupItem>
          </ToggleGroup>

          {/* Chart Type Toggle */}
          <ToggleGroup
            type="single"
            value={chartType}
            onValueChange={(value: "area" | "line") =>
              value && setChartType(value)
            }
            size="sm"
          >
            <ToggleGroupItem value="area">
              <AreaChart className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="line">
              <LineChart className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      {/* --- END HEADER --- */}

      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <ResponsiveContainer>
          <ComposedChart data={data}>
            <CartesianGrid
              vertical={false}
              stroke="hsl(var(--border))"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
              yAxisId="rightSentiment"
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
              yAxisId="rightTrends"
              dataKey="google_score"
              domain={trendDomain}
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
              stroke="hsl(var(--destructive))"
              hide={true} // Hide this axis to avoid clutter
            />

            <Tooltip content={<ChartTooltipContent hideIndicator />} />

            <Legend content={<ChartLegendContent />} />

            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-close)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-close)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            {/* --- Conditional Chart Type --- */}
            {chartType === "area" ? (
              <Area
                dataKey="close"
                type="monotone"
                fill="url(#fillPrice)"
                stroke="var(--color-close)"
                strokeWidth={2}
                yAxisId="left"
                dot={false}
              />
            ) : (
              <Line
                dataKey="close"
                type="monotone"
                stroke="var(--color-close)"
                strokeWidth={2}
                yAxisId="left"
                dot={false}
              />
            )}

            <Line
              dataKey="google_score"
              type="monotone"
              stroke="var(--color-google_score)"
              strokeWidth={2}
              yAxisId="rightTrends"
              dot={false}
            />

            <Bar
              dataKey="avg_sentiment"
              yAxisId="rightSentiment"
              fill="var(--color-avg_sentiment)"
              fillOpacity={0.5}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
};
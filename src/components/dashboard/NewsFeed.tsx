import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface NewsItem {
  headline: string;
  source_name: string;
  time: string;
}

interface NewsFeedProps {
  symbol: string;
  sentiment: "positive" | "negative"; // Removed "all" as it's not needed
}

// Fetcher function
const fetchNews = async (
  symbol: string,
  sentiment: "positive" | "negative",
): Promise<NewsItem[]> => {
  const endpoint =
    sentiment === "positive" ? "positive-news" : "negative-news";
  const { data } = await axios.get(
    `${API_URL}/api/v1/${endpoint}?symbol=${symbol}`,
  );
  return data.data;
};

export const NewsFeed = ({ symbol, sentiment }: NewsFeedProps) => {
  // Use react-query to fetch news
  const {
    data: news,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["news", symbol, sentiment], // Re-fetches when symbol or sentiment changes
    queryFn: () => fetchNews(symbol, sentiment),
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);

    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  const getTitle = () => {
    return sentiment === "positive" ? "Positive News" : "Negative News";
  };

  return (
    <Card className="glass-card p-6 animate-fade-in-up h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{getTitle()}</h2>
        <Badge variant={sentiment === "positive" ? "default" : "destructive"}>
          {sentiment}
        </Badge>
      </div>

      <ScrollArea className="h-96">
        {isLoading ? (
          <div className="space-y-4 pr-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-destructive">Error loading news.</p>
          </div>
        ) : !news || news.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No {sentiment} news found.</p>
          </div>
        ) : (
          <div className="space-y-4 pr-4">
            {news.map((item, index) => (
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  item.headline
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                className="block p-4 rounded-lg border border-border hover:border-primary/50 transition-smooth cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-smooth">
                    {item.headline}
                  </h3>
                  <ExternalLink className="h-3 w-3 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-smooth" />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.source_name}</span>
                  <span className="text-right">{formatTimeAgo(item.time)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
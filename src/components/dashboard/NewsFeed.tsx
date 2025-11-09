import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface NewsItem {
  headline: string;
  source_name: string;
  time: string;
  // Note: We don't get URL or summary from our simple API, but we can adapt
}

interface NewsFeedProps {
  symbol: string;
  sentiment?: "positive" | "negative" | "all";
}

const fetchNews = async (symbol: string, sentiment: string): Promise<NewsItem[]> => {
  let url = "";
  if (sentiment === "positive") {
    url = `${API_URL}/api/v1/positive-news?symbol=${symbol}`;
  } else if (sentiment === "negative") {
    url = `${API_URL}/api/v1/negative-news?symbol=${symbol}`;
  } else {
    // We don't have an "all" endpoint, so we'll just fetch positive for now.
    // You could create an "all" endpoint in FastAPI if you want.
    url = `${API_URL}/api/v1/positive-news?symbol=${symbol}`; 
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }
  const data = await response.json();
  return data.data;
};

export const NewsFeed = ({ symbol, sentiment = "all" }: NewsFeedProps) => {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ["news", symbol, sentiment],
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
    if (sentiment === "positive") return "Positive News";
    if (sentiment === "negative") return "Negative News";
    return "News Feed";
  }

  return (
    <Card className="glass-card p-6 animate-fade-in-up h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{getTitle()}</h2>
        {sentiment !== "all" && (
          <Badge variant={sentiment === "positive" ? "default" : "destructive"}>
            {sentiment}
          </Badge>
        )}
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
        ) : (
          <div className="space-y-4 pr-4">
            {news?.map((item, index) => (
              <div
                key={index}
                className="group p-4 rounded-lg border border-border hover:border-primary/50 transition-smooth"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-smooth">
                    {item.headline}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.source_name}</span>
                  <span className="text-right">{formatTimeAgo(item.time)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  sentiment: "positive" | "negative";
}

interface NewsFeedProps {
  symbol: string;
  sentiment?: "positive" | "negative" | "all";
  // Expected API response: NewsItem[]
}

export const NewsFeed = ({ symbol, sentiment = "all" }: NewsFeedProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // TODO: Replace with actual API call
    // fetch(`/api/news/${symbol}?sentiment=${sentiment}`)
    //   .then(res => res.json())
    //   .then(data => setNews(data))
    //   .finally(() => setLoading(false))

    // Mock data for demonstration
    const mockNews: NewsItem[] = [
      {
        id: "1",
        title: "Company Reports Strong Q4 Earnings",
        summary: "Revenue exceeded expectations by 15%, showing robust growth in key markets.",
        url: "#",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        sentiment: "positive" as const,
      },
      {
        id: "2",
        title: "Market Volatility Affects Stock Price",
        summary: "Concerns over global economic conditions lead to temporary decline.",
        url: "#",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        sentiment: "negative" as const,
      },
      {
        id: "3",
        title: "New Partnership Announcement",
        summary: "Strategic collaboration expected to drive innovation and market expansion.",
        url: "#",
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        sentiment: "positive" as const,
      },
      {
        id: "4",
        title: "Regulatory Challenges Emerge",
        summary: "New compliance requirements may impact operational efficiency.",
        url: "#",
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        sentiment: "negative" as const,
      },
      {
        id: "5",
        title: "Product Launch Success",
        summary: "Latest product receives positive market reception and strong pre-orders.",
        url: "#",
        publishedAt: new Date(Date.now() - 18000000).toISOString(),
        sentiment: "positive" as const,
      },
    ].filter(item => sentiment === "all" || item.sentiment === sentiment);

    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 500);
  }, [symbol, sentiment]);

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

  return (
    <Card className="glass-card p-6 animate-fade-in-up h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">News Feed</h2>
        {sentiment !== "all" && (
          <Badge variant={sentiment === "positive" ? "default" : "destructive"}>
            {sentiment}
          </Badge>
        )}
      </div>

      <ScrollArea className="h-96">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-muted-foreground">Loading news...</div>
          </div>
        ) : (
          <div className="space-y-4 pr-4">
            {news.map((item) => (
              <div
                key={item.id}
                className="group p-4 rounded-lg border border-border hover:border-primary/50 transition-smooth cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-smooth">
                    {item.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className={
                      item.sentiment === "positive"
                        ? "border-positive text-positive"
                        : "border-negative text-negative"
                    }
                  >
                    {item.sentiment}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatTimeAgo(item.publishedAt)}</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-smooth"
                  >
                    Read more <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

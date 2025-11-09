import { useState, useEffect, useRef } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
}

interface SymbolSearchProps {
  onSelectSymbol: (symbol: string) => void;
  currentSymbol: string;
}

// Live search function
const fetchSearchResults = async (query: string): Promise<SearchResult[]> => {
  if (query.length < 1) {
    return [];
  }
  const { data } = await axios.get(
    `${API_URL}/api/v1/search?query=${query}`,
  );
  return data.data;
};

export const SymbolSearch = ({
  onSelectSymbol,
  currentSymbol,
}: SymbolSearchProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Use react-query to fetch search results
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearchResults(query),
    enabled: query.length > 0, // Only run query if user is typing
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    onSelectSymbol(symbol);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search symbols (e.g., TSLA, BTC)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 glass-card border-glass-border"
        />
      </div>

      {isOpen && query.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 glass-card border-glass-border z-100 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result.symbol}
                  onClick={() => handleSelect(result.symbol)}
                  className="w-full px-4 py-3 text-left hover:bg-accent transition-smooth flex items-center justify-between group"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-sm group-hover:text-primary transition-smooth">
                      {result.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {result.name}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.exchange}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
        </Card>
      )}

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4" />
        <span>
          Current:{" "}
          <span className="font-semibold text-foreground">
            {currentSymbol}
          </span>
        </span>
      </div>
    </div>
  );
};
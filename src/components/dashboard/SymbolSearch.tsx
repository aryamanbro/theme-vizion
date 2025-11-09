import { useState, useEffect, useRef } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
}

interface SymbolSearchProps {
  onSelectSymbol: (symbol: string) => void;
  currentSymbol: string;
}

export const SymbolSearch = ({ onSelectSymbol, currentSymbol }: SymbolSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);

    // TODO: Replace with actual API call
    // fetch(`/api/search?query=${query}`)
    //   .then(res => res.json())
    //   .then(data => setResults(data))
    //   .finally(() => setLoading(false))

    // Mock data for demonstration
    const mockResults: SearchResult[] = [
      { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
      { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ" },
      { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ" },
      { symbol: "TSLA", name: "Tesla, Inc.", exchange: "NASDAQ" },
      { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ" },
    ].filter(
      (item) =>
        item.symbol.toLowerCase().includes(query.toLowerCase()) ||
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    const timer = setTimeout(() => {
      setResults(mockResults);
      setIsOpen(mockResults.length > 0);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

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
          placeholder="Search symbols..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && results.length > 0 && setIsOpen(true)}
          className="pl-10 glass-card border-glass-border"
        />
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 glass-card border-glass-border z-50 max-h-80 overflow-y-auto">
          {loading ? (
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
                    <div className="text-xs text-muted-foreground">{result.name}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{result.exchange}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found
            </div>
          )}
        </Card>
      )}

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4" />
        <span>Current: <span className="font-semibold text-foreground">{currentSymbol}</span></span>
      </div>
    </div>
  );
};

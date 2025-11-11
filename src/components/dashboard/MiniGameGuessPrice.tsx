import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, RefreshCw } from "lucide-react";

interface MiniGameGuessPriceProps {
  currentSymbol: string;
}

const getPriceRanges = (symbol: string) => {
  // Mock ranges based on a few common symbols for a fun, baseless guess
  switch (symbol.toUpperCase()) {
    case "TSLA":
      return ["Under $150", "$150 - $250", "Over $250"];
    case "AAPL":
      return ["Under $170", "$170 - $200", "Over $200"];
    case "BTC":
      return ["Under $50k", "$50k - $70k", "Over $70k"];
    default:
      return ["Low", "Mid", "High"];
  }
};

export const MiniGameGuessPrice = ({ currentSymbol }: MiniGameGuessPriceProps) => {
  const ranges = getPriceRanges(currentSymbol);
  const [guess, setGuess] = useState<string | null>(null);
  const [result, setResult] = useState<"win" | "lose" | null>(null);

  const handleGuess = (selectedRange: string) => {
    setGuess(selectedRange);
    // Simulate result after delay. For simplicity, we choose a fixed 'correct' one or a random one.
    setTimeout(() => {
      const isWin = Math.random() < 0.33;
      setResult(isWin ? "win" : "lose");
    }, 500);
  };

  const handleReset = () => {
    setGuess(null);
    setResult(null);
  };

  return (
    <Card className="glass-card w-full animate-fade-in-up">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Price Guess Game ({currentSymbol})</span>
          <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Reset Game">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground text-sm mb-4">
          Guess where **{currentSymbol}**'s price will close today.
        </p>

        <div className="flex flex-col gap-2">
          {ranges.map((range) => (
            <Button
              key={range}
              onClick={() => handleGuess(range)}
              variant={guess === range ? "default" : "secondary"}
              disabled={!!guess}
              className="justify-start"
            >
              <DollarSign className="mr-2 h-4 w-4" /> {range}
            </Button>
          ))}
        </div>

        {result && (
          <div className="mt-4 text-center">
            {result === "win" ? (
              <p className="text-positive font-semibold text-lg animate-flash-positive">
                💰 You nailed it! Market moves are in your favor.
              </p>
            ) : (
              <p className="text-negative font-semibold text-lg animate-flash-negative">
                📉 Close, but no cigar. Our AI does better.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
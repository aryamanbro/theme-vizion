import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { useState } from "react";

const generateRandomTicker = () => {
  const tickers = ["AAPL", "TSLA", "MSFT", "GOOG", "AMZN", "ETH", "BTC", "NVDA"];
  return tickers[Math.floor(Math.random() * tickers.length)];
};

// Accept currentSymbol for consistency, but use random for game element
export const MiniGamePredict = ({ currentSymbol }: { currentSymbol: string }) => {
  const [ticker, setTicker] = useState(generateRandomTicker);
  const [prediction, setPrediction] = useState<"up" | "down" | null>(null);
  const [result, setResult] = useState<"win" | "lose" | null>(null);

  const handlePredict = (guess: "up" | "down") => {
    setPrediction(guess);
    // Simulate a random result after a short delay
    setTimeout(() => {
      const isWin = Math.random() > 0.5;
      setResult(isWin ? "win" : "lose");
    }, 500);
  };

  const handleReset = () => {
    setPrediction(null);
    setResult(null);
    setTicker(generateRandomTicker);
  };

  return (
    <Card className="glass-card w-full animate-fade-in-up">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Cold Start Mini-Game</span>
          <Button variant="ghost" size="icon" onClick={handleReset} aria-label="New Prediction">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground text-sm mb-4">
          Predict the next move for **{ticker}** while we warm up the backend.
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => handlePredict("up")}
            variant={prediction === "up" ? "default" : "outline"}
            disabled={!!prediction}
            className="flex-1"
          >
            <TrendingUp className="mr-2 h-4 w-4" /> Up
          </Button>
          <Button
            onClick={() => handlePredict("down")}
            variant={prediction === "down" ? "destructive" : "outline"}
            disabled={!!prediction}
            className="flex-1"
          >
            <TrendingDown className="mr-2 h-4 w-4" /> Down
          </Button>
        </div>

        {result && (
          <div className="mt-4 text-center">
            {result === "win" ? (
              <p className="text-positive font-semibold text-lg animate-flash-positive">
                ✅ You won! Market moves are in your favor.
              </p>
            ) : (
              <p className="text-negative font-semibold text-lg animate-flash-negative">
                ❌ You lost. Better luck next time.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, Bug, ArrowRight, Gamepad2 } from "lucide-react";
import { MiniGamePredict } from "./MiniGamePredict";
import { MiniGameGuessPrice } from "./MiniGameGuessPrice";
import { useState } from "react";

interface LoadingViewProps {
  progress: number;
  debugMode: boolean;
  onExitDebugMode: () => void;
  currentSymbol: string;
}

const ALL_GAMES = [
    { component: MiniGamePredict, title: "Market Prediction" },
    { component: MiniGameGuessPrice, title: "Price Guess" },
];

export const LoadingView = ({
  progress,
  debugMode,
  onExitDebugMode,
  currentSymbol,
}: LoadingViewProps) => {
  // State to track which game is currently active
  const [gameIndex, setGameIndex] = useState(0);

  // Function to cycle to the next game
  const cycleGame = () => {
    setGameIndex((prevIndex) => (prevIndex + 1) % ALL_GAMES.length);
  };
  
  const ActiveGame = ALL_GAMES[gameIndex];
  const GameComponent = ActiveGame.component;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="flex flex-col items-center justify-center max-w-lg w-full text-center space-y-8">
        <div className="p-4 bg-primary rounded-xl mb-4 animate-bounce">
          <TrendingUp className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          FinSent Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          {debugMode
            ? "Debug Mode: Simulating cold start..."
            : "Warming up the Financial Intelligence Backend..."}
        </p>

        <div className="w-full space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {progress.toFixed(0)}% Complete
          </p>
        </div>

        {debugMode && (
          <Button
            onClick={onExitDebugMode}
            variant="outline"
            className="animate-fade-in-up"
          >
            <Bug className="h-4 w-4 mr-2" /> Exit Debug Mode
          </Button>
        )}
        
        {/* Active Mini-Game */}
        {/* We use the game title as a 'key' prop to force a re-mount when the game index changes, ensuring game state resets */}
        <div key={ActiveGame.title} className="w-full">
            <GameComponent currentSymbol={currentSymbol} />
        </div>

        {/* Change Game Button */}
        <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            <Button
                onClick={cycleGame}
                variant="link"
                size="sm"
                className="text-sm text-muted-foreground hover:text-primary transition-smooth p-0 h-auto"
            >
                Try the other game: {ALL_GAMES[(gameIndex + 1) % ALL_GAMES.length].title}
            </Button>
        </div>
        
      </div>
    </div>
  );
};
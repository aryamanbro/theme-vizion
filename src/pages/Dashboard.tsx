import { useState } from "react";
import { LiveTicker } from "@/components/dashboard/LiveTicker";
import { MainChart } from "@/components/dashboard/MainChart";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { SymbolSearch } from "@/components/dashboard/SymbolSearch";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { BarChart3 } from "lucide-react";

const Dashboard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">FinSent Dashboard</h1>
                <p className="text-sm text-muted-foreground">Real-time Financial Insights</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Search & Ticker */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-6 animate-fade-in-up">
              <h2 className="text-lg font-semibold mb-4">Symbol Search</h2>
              <SymbolSearch
                onSelectSymbol={setSelectedSymbol}
                currentSymbol={selectedSymbol}
              />
            </div>
            
            <LiveTicker symbol={selectedSymbol} />
          </div>

          {/* Main Chart Area */}
          <div className="lg:col-span-6">
            <MainChart symbol={selectedSymbol} />
          </div>

          {/* Right Sidebar - News Feed */}
          <div className="lg:col-span-3">
            <NewsFeed symbol={selectedSymbol} sentiment="all" />
          </div>
        </div>

        {/* Bottom Section - Sentiment News Feeds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <NewsFeed symbol={selectedSymbol} sentiment="positive" />
          <NewsFeed symbol={selectedSymbol} sentiment="negative" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border glass-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 FinSent Dashboard. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-smooth">About</a>
              <a href="#" className="hover:text-primary transition-smooth">API Docs</a>
              <a href="#" className="hover:text-primary transition-smooth">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

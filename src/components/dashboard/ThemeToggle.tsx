import { Moon, Sun, Paintbrush } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="transition-smooth hover:scale-105"
          aria-label="Toggle theme"
        >
          {/* Default icon */}
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-red")}>
          <Paintbrush className="mr-2 h-4 w-4" />
          <span>Dark Red</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-blue")}>
          <Paintbrush className="mr-2 h-4 w-4" />
          <span>Dark Blue</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-purple")}>
          <Paintbrush className="mr-2 h-4 w-4" />
          <span>Dark Purple</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
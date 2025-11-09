import { Moon, Paintbrush, Sun } from "lucide-react";
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
        
        {/* --- Duo-Tone Themes --- */}
        <DropdownMenuItem onClick={() => setTheme("dark-blue")}>
          <Paintbrush className="mr-2 h-4 w-4" />
          <span>Dark Blue</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-sunset")}>
          <Paintbrush className="mr-2 h-4 w-4" />
          <span>Dark Sunset</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-ocean")}>
          <Paintbrush className="mr-2 h-4 w-4" />
          <span>Dark Ocean</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-forest")}>
          <Paintbrush className="mr-2 h-4 w-4" />
          <span>Dark Forest</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-twilight")}>
          <Paintbrush className="mr-2 h-4 w-4" />
          <span>Dark Twilight</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
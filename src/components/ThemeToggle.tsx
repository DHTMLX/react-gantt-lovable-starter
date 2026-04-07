import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      aria-label="Toggle theme"
      className="gap-2 h-9 px-3 text-xs font-medium"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Day mode</span>
        </>
      ) : (
        <>
          <Moon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Night mode</span>
        </>
      )}
    </Button>
  );
}

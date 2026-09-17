import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

/*
 * Toggle for the reading pages.
 *
 * Both icons are rendered and swapped with the `dark` class on <html>, so the
 * correct one is showing on the first paint rather than after hydration. The
 * state from useTheme only drives `aria-pressed`.
 */
export const ThemeToggle = (props?: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      aria-pressed={theme === "dark"}
      className={`rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 ${
        props?.className ?? ""
      }`}
    >
      <Sun className="h-4 w-4 dark:hidden" aria-hidden="true" />
      <Moon className="hidden h-4 w-4 dark:block" aria-hidden="true" />
    </button>
  );
};

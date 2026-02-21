import { useEffect } from "react";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <main className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      {/* nav later */}
      <h1 className="text-2xl pt-10 text-center">
        REST Countries API is Ready!
      </h1>
      <p className="text-center">
        Theme is currently: {isDarkMode ? "🌙 Dark" : "☀️ Light"}
      </p>
    </main>
  );
}

export default App;

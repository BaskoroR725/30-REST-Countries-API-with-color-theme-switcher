import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { Navbar } from "../components/Navbar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark transition-colors duration-300">
      <Navbar />
      <main className="max-w-[1440px] mx-auto grow px-4 md:px-20 py-6 md:py-12">
        <Outlet />
      </main>
      <footer className="py-8 text-center text-sm">
        <div className="attribution">
          Challenge by{" "}
          <a
            href="https://www.frontendmentor.io?ref=challenge"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Frontend Mentor
          </a>
          . Coded by{" "}
          <a
            href="https://github.com/BaskoroR725"
            className="text-blue-500 hover:underline"
          >
            Baskoro Ramadhan
          </a>
          .
        </div>
      </footer>
    </div>
  );
}

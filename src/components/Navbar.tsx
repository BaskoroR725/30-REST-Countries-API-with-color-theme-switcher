import { useThemeStore } from "../store/useThemeStore";
import { Moon, Sun } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <nav className="sticky top-0 z-50 w-full bg-elements-light dark:bg-elements-dark shadow-md transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 md:px-20 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="text-lg md:text-2xl font-extrabold text-text-light dark:text-text-dark hover:opacity-80 transition-opacity"
        >
          Where in the world?
        </Link>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="flex items-center gap-2 font-semibold text-sm md:text-base text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/5 px-3 py-2 rounded-md transition-all"
          aria-label="Toggle dark mode"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isDarkMode ? "dark" : "light"}
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              {isDarkMode ? (
                <>
                  <Sun size={18} fill="currentColor" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} />
                  <span>Dark Mode</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
    </nav>
  );
};

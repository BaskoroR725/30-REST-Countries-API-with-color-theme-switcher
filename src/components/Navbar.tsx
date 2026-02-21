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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleTheme}
          className="flex items-center gap-2 font-semibold text-sm md:text-base text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10 px-4 py-2 rounded-lg transition-all border border-transparent dark:border-white/5 shadow-sm active:shadow-inner"
          aria-label="Toggle dark mode"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isDarkMode ? "dark" : "light"}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex items-center gap-2"
            >
              {isDarkMode ? (
                <>
                  <Sun
                    size={18}
                    className="text-amber-400"
                    fill="currentColor"
                  />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} className="text-slate-700" />
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

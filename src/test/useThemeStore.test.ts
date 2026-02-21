import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "../store/useThemeStore";

describe("useThemeStore", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    useThemeStore.setState({ isDarkMode: false });
  });

  it("should toggle theme and update DOM class", () => {
    const { toggleTheme } = useThemeStore.getState();

    // Toggle to dark
    toggleTheme();
    expect(useThemeStore.getState().isDarkMode).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Toggle back to light
    toggleTheme();
    expect(useThemeStore.getState().isDarkMode).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

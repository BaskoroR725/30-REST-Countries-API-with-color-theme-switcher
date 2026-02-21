import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <main className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark transition-colors duration-300">
      {/* <Navbar /> */} 
      <Outlet />
    </main>
  );
}
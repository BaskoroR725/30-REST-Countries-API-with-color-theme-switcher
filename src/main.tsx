import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './index.css';

// Import route tree 
import { Route as rootRoute } from './routes/__root';
import { Route as indexRoute } from './routes/index';

// Buat route tree
const routeTree = rootRoute.addChildren([indexRoute]);

// Buat instance router
const router = createRouter({ routeTree });

// Daftarkan router untuk keamanan tipe data (Type Safety)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
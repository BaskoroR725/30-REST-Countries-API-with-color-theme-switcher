import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";

// Import route tree
import { Route as rootRoute } from "./routes/__root";
import { Route as indexRoute } from "./routes/index";
import { Route as detailRoute } from "./routes/country.$countryCode";

// Buat route tree
const routeTree = rootRoute.addChildren([indexRoute, detailRoute]);

// Buat instance router
const router = createRouter({
  routeTree,
  basepath: "/30-REST-Countries-API-with-color-theme-switcher/",
});

// Daftarkan router untuk keamanan tipe data (Type Safety)
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

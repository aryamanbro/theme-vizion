import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="data-theme"
    defaultTheme="dark-blue"
    themes={[
      "light",
      "dark-blue",
      "dark-sunset",
      "dark-ocean",
      "dark-forest",
      "dark-twilight",
    ]}
  >
    <App />
  </ThemeProvider>,
);
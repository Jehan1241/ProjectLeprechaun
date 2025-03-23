import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";
import { BrowserRouter, HashRouter, MemoryRouter } from "react-router";
import { SortProvider } from "./hooks/useSortContex";
import { NavigationProvider } from "./hooks/useNavigationContext";

// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MemoryRouter>
    <NavigationProvider>
      <SortProvider>
        <App />
      </SortProvider>
    </NavigationProvider>
  </MemoryRouter>
);

postMessage({ payload: "removeLoading" }, "*");

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { DEMO } from "./config";
import { instalarApiDemo } from "./demo/api";

// Importar nuestro tema SCSS personalizado en lugar del CSS de Bootstrap
import "./styles/custom.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

if (DEMO) instalarApiDemo();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);


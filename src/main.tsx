// The starting point. index.html loads this file, and it puts the <App />
// component inside the page's <div id="root">.
//
// StrictMode is a development helper: it runs some code twice on purpose to
// reveal bugs early. It does nothing in the built app.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./lib/maplibreWorker"; // must run before any map is created
import App from "./App";
import "./styles/global.css";

const root = document.getElementById("root");
if (!root) throw new Error("index.html is missing <div id=\"root\">");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

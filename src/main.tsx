import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";
import { initializeMicrosoftAuth } from "./services/microsoftAuth";

// Detect if we are running inside an MSAL login popup or iframe renew session
const isMsalFramed = () => {
  return (
    typeof window !== "undefined" &&
    ((window.opener && window.opener !== window) ||
      (window.parent && window.parent !== window))
  );
};

// Check if the current URL contains MSAL authentication hash tokens
const hasMsalHash = () => {
  return (
    typeof window !== "undefined" &&
    window.location.hash &&
    (window.location.hash.includes("state=") || window.location.hash.includes("code="))
  );
};

if (isMsalFramed()) {
  if (hasMsalHash()) {
    // We are inside the MSAL popup/iframe context and we have the authentication hash.
    // We must run MSAL's redirect promise handler to process the token,
    // notify the parent window, and close the popup automatically.
    // However, we do NOT bootstrap React here to avoid loading the entire dashboard.
    initializeMicrosoftAuth()
      .then(() => {
        console.log("MSAL popup/iframe context handled successfully.");
      })
      .catch((err) => {
        console.error("MSAL popup/iframe context initialization failed:", err);
      });
  } else {
    // We are inside the popup, but it was just opened (no hash yet).
    // Do nothing so that the parent window's MSAL can safely set the popup's URL to Microsoft login!
    console.log("MSAL child window opened. Waiting for redirection...");
  }
} else {
  // Parent window bootstraps React application normally
  initializeMicrosoftAuth()
    .catch((err) => {
      console.error("Failed to pre-initialize MSAL:", err);
    })
    .finally(() => {
      ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </React.StrictMode>
      );
    });
}
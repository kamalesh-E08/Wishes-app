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

import AuthProvider from "./components/auth/AuthProvider";

if (isMsalFramed()) {
  if (hasMsalHash()) {
    initializeMicrosoftAuth()
      .then(() => {
        console.log("MSAL popup/iframe context handled successfully.");
      })
      .catch((err) => {
        console.error("MSAL popup/iframe context initialization failed:", err);
      });
  } else {
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
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </React.StrictMode>
      );
    });
}
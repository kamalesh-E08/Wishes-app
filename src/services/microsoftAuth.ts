import {
  PublicClientApplication,
  BrowserCacheLocation,
} from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_MS_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MS_TENANT_ID}`,
    redirectUri: "http://localhost:5173/events",
  },

  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: true,
  },
} as any);

let initialized = false;

export const initializeMicrosoftAuth = async () => {
  if (initialized) return;

  await msalInstance.initialize();

  try {
    const response = await msalInstance.handleRedirectPromise();

    if (response?.account) {
      msalInstance.setActiveAccount(response.account);
      console.log("Microsoft Login Success");
    } else {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }
    }
  } catch (err: any) {
    const isCacheError = err?.errorCode === "no_token_request_cache_error" || 
                         (err?.message && err.message.includes("no_token_request_cache_error"));
    if (isCacheError) {
      console.log("MSAL: No active redirect flow request cache found (expected when logging in via popups).");
    } else {
      console.error("Microsoft Auth initialization redirect handler error:", err);
    }
    // fallback check
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
    }
  }

  // Clear stale hash parameters if present from previous redirects to prevent future loop errors
  if (
    typeof window !== "undefined" &&
    window.location.hash &&
    (window.location.hash.includes("state=") || window.location.hash.includes("code="))
  ) {
    try {
      window.history.replaceState(
        null,
        document.title,
        window.location.pathname + window.location.search
      );
    } catch (e) {
      console.error("Failed to clear hash from URL:", e);
    }
  }

  initialized = true;
};

export const loginToOneDrive = async () => {
  await initializeMicrosoftAuth();

  await msalInstance.loginRedirect({
    scopes: ["User.Read", "Files.Read", "offline_access"],
  });
};

export const getCurrentAccount = async () => {
  await initializeMicrosoftAuth();

  return msalInstance.getActiveAccount();
};

export const logoutFromOneDrive = async () => {
  await initializeMicrosoftAuth();

  await msalInstance.logoutRedirect({
    postLogoutRedirectUri: "http://localhost:5173/events",
  });
};

export const getAccessToken = async () => {
  await initializeMicrosoftAuth();

  const account = msalInstance.getActiveAccount();

  if (!account) {
    throw new Error("No Microsoft account connected");
  }

  const response = await msalInstance.acquireTokenSilent({
    account,
    scopes: ["User.Read", "Files.Read"],
  });

  return response.accessToken;
};
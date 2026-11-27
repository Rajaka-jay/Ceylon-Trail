const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
export const API_URL = (configuredApiUrl || "/api").replace(/\/+$/, "");
export const API_CONFIGURED = Boolean(configuredApiUrl) || import.meta.env.DEV;
export const API_CONFIGURATION_MESSAGE =
  "Sign-in needs a deployed backend. Set the GitHub Actions variable VITE_API_URL to the backend API URL ending in /api, then redeploy GitHub Pages.";

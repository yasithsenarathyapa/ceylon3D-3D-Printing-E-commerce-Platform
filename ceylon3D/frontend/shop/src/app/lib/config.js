const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!configuredApiBaseUrl && !import.meta.env.DEV) {
  console.warn(
    "VITE_API_BASE_URL is not set. Falling back to /api. Set VITE_API_BASE_URL in Vercel to your backend URL."
  );
}

const fallbackApiBaseUrl = import.meta.env.DEV ? "http://localhost:8080/api" : "/api";

export const API_BASE_URL = (configuredApiBaseUrl || fallbackApiBaseUrl).replace(/\/$/, "");
export const API_ROOT_URL = API_BASE_URL.replace(/\/api\/?$/, "");
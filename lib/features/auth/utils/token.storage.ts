const ACCESS_TOKEN_KEY = "did_access_token";
const REFRESH_TOKEN_KEY = "did_refresh_token";

let memoryAccessToken: string | null = null;

export const tokenStorage = {
  getAccessToken(): string | null {
    return (
      memoryAccessToken ||
      (typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null)
    );
  },

  setAccessToken(token: string): void {
    memoryAccessToken = token;
    if (typeof window !== "undefined") {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },

  clear(): void {
    memoryAccessToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  hasTokens(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  },
};

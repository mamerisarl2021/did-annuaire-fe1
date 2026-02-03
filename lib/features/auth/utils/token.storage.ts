import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN_KEY = "did_access_token";
const REFRESH_TOKEN_KEY = "did_refresh_token";

let memoryAccessToken: string | null = null;

interface JWTPayload {
  exp?: number;
  iat?: number;
  user_id?: string;
}

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

  /**
   * Decode JWT token and extract expiration timestamp
   * @param token - JWT token string
   * @returns Expiration timestamp in seconds, or null if invalid
   */
  getTokenExpirationTime(token?: string): number | null {
    try {
      const tokenToCheck = token || this.getAccessToken();
      if (!tokenToCheck) return null;

      const decoded = jwtDecode<JWTPayload>(tokenToCheck);
      return decoded.exp || null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Check if a token is expired
   * @param token - Optional token to check. If not provided, checks the stored access token
   * @returns true if token is expired, false otherwise
   */
  isTokenExpired(token?: string): boolean {
    const expirationTime = this.getTokenExpirationTime(token);
    if (!expirationTime) return true;

    // Get current time in seconds and add a 30-second buffer for safety
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferSeconds = 30;

    return currentTime >= expirationTime - bufferSeconds;
  },

  /**
   * Get time remaining until token expiration
   * @param token - Optional token to check. If not provided, checks the stored access token
   * @returns Time remaining in milliseconds, or null if token is invalid/expired
   */
  getTimeUntilExpiration(token?: string): number | null {
    const expirationTime = this.getTokenExpirationTime(token);
    if (!expirationTime) return null;

    const currentTime = Math.floor(Date.now() / 1000);
    const remainingSeconds = expirationTime - currentTime;

    return remainingSeconds > 0 ? remainingSeconds * 1000 : null;
  },

  /**
   * Check if refresh token is expired
   * @returns true if refresh token is expired, false otherwise
   */
  isRefreshTokenExpired(): boolean {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return true;

    return this.isTokenExpired(refreshToken);
  },
};

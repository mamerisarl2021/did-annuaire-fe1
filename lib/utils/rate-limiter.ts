class RateLimiter {
  private attempts = new Map<string, number[]>();

  /**
   * @param key
   * @param maxAttempts
   * @param windowMs
   * @returns
   */
  canAttempt(key: string, maxAttempts = 5, windowMs = 60000): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    const recentAttempts = userAttempts.filter((time) => now - time < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  /**
   * Get remaining time until rate limit expires
   * @param key - Unique identifier
   * @param windowMs - Time window in milliseconds
   * @returns Remaining milliseconds, or 0 if not rate limited
   */
  getRemainingTime(key: string, windowMs = 60000): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    const elapsed = Date.now() - oldestAttempt;
    return Math.max(0, windowMs - elapsed);
  }

  /**
   * Reset rate limit for a key (e.g., after successful login)
   * @param key - Unique identifier
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Get current attempt count for a key
   * @param key - Unique identifier
   * @param windowMs - Time window in milliseconds
   * @returns Number of attempts in the current window
   */
  getAttemptCount(key: string, windowMs = 60000): number {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    return userAttempts.filter((time) => now - time < windowMs).length;
  }

  /**
   * Clear all rate limit data (useful for testing)
   */
  clearAll(): void {
    this.attempts.clear();
  }
}

// Singleton instances for different use cases
export const loginRateLimiter = new RateLimiter();
export const otpRateLimiter = new RateLimiter();

// Export class for testing
export { RateLimiter };

import { describe, it, expect, beforeEach } from "vitest";
import { RateLimiter, loginRateLimiter, otpRateLimiter } from "@/lib/utils/rate-limiter";

describe("RateLimiter", () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter();
  });

  describe("canAttempt", () => {
    it("should allow first attempt", () => {
      const result = rateLimiter.canAttempt("test@example.com");
      expect(result).toBe(true);
    });

    it("should allow attempts up to the limit", () => {
      const email = "test@example.com";

      // Should allow 5 attempts (default)
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.canAttempt(email)).toBe(true);
      }

      // 6th attempt should be blocked
      expect(rateLimiter.canAttempt(email)).toBe(false);
    });

    it("should respect custom maxAttempts", () => {
      const email = "test@example.com";

      // Allow 3 attempts
      for (let i = 0; i < 3; i++) {
        expect(rateLimiter.canAttempt(email, 3, 60000)).toBe(true);
      }

      // 4th attempt should be blocked
      expect(rateLimiter.canAttempt(email, 3, 60000)).toBe(false);
    });

    it("should track different keys separately", () => {
      expect(rateLimiter.canAttempt("user1@example.com")).toBe(true);
      expect(rateLimiter.canAttempt("user2@example.com")).toBe(true);

      // Fill up user1's limit
      for (let i = 0; i < 4; i++) {
        rateLimiter.canAttempt("user1@example.com");
      }

      // user1 should be blocked
      expect(rateLimiter.canAttempt("user1@example.com")).toBe(false);

      // user2 should still be allowed
      expect(rateLimiter.canAttempt("user2@example.com")).toBe(true);
    });
  });

  describe("getRemainingTime", () => {
    it("should return 0 for no attempts", () => {
      const remaining = rateLimiter.getRemainingTime("test@example.com");
      expect(remaining).toBe(0);
    });

    it("should return remaining time when rate limited", () => {
      const email = "test@example.com";
      const windowMs = 60000; // 1 minute

      // Max out attempts
      for (let i = 0; i < 5; i++) {
        rateLimiter.canAttempt(email, 5, windowMs);
      }

      const remaining = rateLimiter.getRemainingTime(email, windowMs);

      // Should be close to 60000ms (allowing for execution time)
      expect(remaining).toBeGreaterThan(59000);
      expect(remaining).toBeLessThanOrEqual(60000);
    });
  });

  describe("reset", () => {
    it("should reset attempts for a key", () => {
      const email = "test@example.com";

      // Max out attempts
      for (let i = 0; i < 5; i++) {
        rateLimiter.canAttempt(email);
      }

      // Should be blocked
      expect(rateLimiter.canAttempt(email)).toBe(false);

      // Reset
      rateLimiter.reset(email);

      // Should be allowed again
      expect(rateLimiter.canAttempt(email)).toBe(true);
    });
  });

  describe("getAttemptCount", () => {
    it("should return 0 for no attempts", () => {
      const count = rateLimiter.getAttemptCount("test@example.com");
      expect(count).toBe(0);
    });

    it("should return correct attempt count", () => {
      const email = "test@example.com";

      rateLimiter.canAttempt(email);
      expect(rateLimiter.getAttemptCount(email)).toBe(1);

      rateLimiter.canAttempt(email);
      expect(rateLimiter.getAttemptCount(email)).toBe(2);

      rateLimiter.canAttempt(email);
      expect(rateLimiter.getAttemptCount(email)).toBe(3);
    });
  });

  describe("clearAll", () => {
    it("should clear all rate limit data", () => {
      rateLimiter.canAttempt("user1@example.com");
      rateLimiter.canAttempt("user2@example.com");

      rateLimiter.clearAll();

      expect(rateLimiter.getAttemptCount("user1@example.com")).toBe(0);
      expect(rateLimiter.getAttemptCount("user2@example.com")).toBe(0);
    });
  });
});

describe("Singleton instances", () => {
  beforeEach(() => {
    loginRateLimiter.clearAll();
    otpRateLimiter.clearAll();
  });

  it("should have separate loginRateLimiter instance", () => {
    expect(loginRateLimiter).toBeInstanceOf(RateLimiter);
    expect(loginRateLimiter.canAttempt("test@example.com")).toBe(true);
  });

  it("should have separate otpRateLimiter instance", () => {
    expect(otpRateLimiter).toBeInstanceOf(RateLimiter);
    expect(otpRateLimiter.canAttempt("otp_generation")).toBe(true);
  });

  it("should maintain separate state between instances", () => {
    // Max out login limiter
    for (let i = 0; i < 5; i++) {
      loginRateLimiter.canAttempt("test@example.com");
    }

    // Login should be blocked
    expect(loginRateLimiter.canAttempt("test@example.com")).toBe(false);

    // OTP should still work
    expect(otpRateLimiter.canAttempt("otp_generation")).toBe(true);
  });
});

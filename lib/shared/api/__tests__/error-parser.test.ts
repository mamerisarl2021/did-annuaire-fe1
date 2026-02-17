import { describe, it, expect } from "vitest";
import { ErrorParser } from "../error-parser";

describe("ErrorParser", () => {
  it("should parse a standard backend error", async () => {
    const mockResponse = {
      message: "Invalid credentials",
      code: "AUTH_FAILED",
      status: 401,
    };

    const result = ErrorParser.parse(mockResponse);
    expect(result.message).toBe("Invalid credentials");
    expect(result.code).toBe("AUTH_FAILED");
    expect(result.status).toBe(401);
  });

  it("should parse a legacy error response", () => {
    const mockLegacy = {
      detail: "Something went wrong",
      code: "LEGACY_ERR",
    };

    const result = ErrorParser.parse(mockLegacy);
    expect(result.message).toBe("Something went wrong");
    expect(result.code).toBe("LEGACY_ERR");
  });

  it("should handle network errors (TypeError)", () => {
    const networkError = new TypeError("Failed to fetch");
    const result = ErrorParser.parse(networkError);

    expect(result.isNetworkError).toBe(true);
    expect(result.code).toBe("NETWORK_ERROR");
  });

  it("should normalize a string error", () => {
    const result = ErrorParser.parse("Simple error message");
    expect(result.message).toBe("Simple error message");
    expect(result.code).toBe("UNKNOWN_ERROR");
  });

  it("should extract field errors from standard format", () => {
    const mockError = {
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      errors: {
        email: ["Invalid email format"],
        password: ["Too short"],
      },
    };

    const result = ErrorParser.parse(mockError);
    expect(result.fieldErrors).toBeDefined();
    expect(result.fieldErrors?.email).toContain("Invalid email format");
  });
});

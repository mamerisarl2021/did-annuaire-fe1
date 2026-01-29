import { describe, it, expect } from "vitest";
import { authMapper } from "@/lib/features/auth/mappers/auth.mapper";

describe("authMapper", () => {
  describe("normalizeRole", () => {
    it("should normalize SUPERUSER string to SUPER_USER", () => {
      expect(authMapper.normalizeRole("SUPERUSER")).toBe("SUPER_USER");
      expect(authMapper.normalizeRole("superuser")).toBe("SUPER_USER");
    });

    it("should normalize empty list to SUPER_USER", () => {
      expect(authMapper.normalizeRole([])).toBe("SUPER_USER");
    });

    it("should normalize single role list", () => {
      expect(authMapper.normalizeRole(["ORG_ADMIN"])).toBe("ORG_ADMIN");
      expect(authMapper.normalizeRole(["ORG_MEMBER"])).toBe("ORG_MEMBER");
      expect(authMapper.normalizeRole(["AUDITOR"])).toBe("AUDITOR");
    });

    it("should normalize multiple roles with priority", () => {
      expect(authMapper.normalizeRole(["ORG_MEMBER", "AUDITOR"])).toBe("ORG_MEMBER");
      expect(authMapper.normalizeRole(["ORG_ADMIN", "AUDITOR"])).toBe("ORG_ADMIN");
      expect(authMapper.normalizeRole(["SUPER_USER", "ORG_ADMIN"])).toBe("SUPER_USER");
    });

    it("should default to ORG_MEMBER for unknown roles", () => {
      expect(authMapper.normalizeRole("UNKNOWN")).toBe("ORG_MEMBER");
      expect(authMapper.normalizeRole(["UNKNOWN"])).toBe("ORG_MEMBER");
      expect(authMapper.normalizeRole(undefined)).toBe("ORG_MEMBER");
    });
  });

  describe("inferRoleFromFlags", () => {
    it("should infer SUPER_USER from isSuperuser flag", () => {
      expect(authMapper.inferRoleFromFlags(true, false)).toBe("SUPER_USER");
    });

    it("should infer ORG_ADMIN from isStaff flag", () => {
      expect(authMapper.inferRoleFromFlags(false, true)).toBe("ORG_ADMIN");
    });

    it("should prioritize isSuperuser over isStaff", () => {
      expect(authMapper.inferRoleFromFlags(true, true)).toBe("SUPER_USER");
    });

    it("should default to ORG_MEMBER when no flags", () => {
      expect(authMapper.inferRoleFromFlags(false, false)).toBe("ORG_MEMBER");
    });
  });

  describe("mergeUserData", () => {
    it("should merge JWT and API data correctly", () => {
      const jwtData = {
        id: "jwt-id",
        email: "jwt@example.com",
        role: "ORG_MEMBER" as const,
        organization_id: "jwt-org",
      };

      const apiData = {
        id: "api-id",
        email: "api@example.com",
        role: "ORG_ADMIN",
        organization: { id: "api-org", name: "Test Org" },
        full_name: "Test User",
      };

      const result = authMapper.mergeUserData(jwtData, apiData);

      expect(result.id).toBe("api-id"); // API data priority
      expect(result.email).toBe("api@example.com");
      expect(result.role).toBe("ORG_ADMIN");
      expect(result.roles).toEqual(["ORG_ADMIN"]);
      expect(result.organization_id).toBe("api-org");
      expect(result.full_name).toBe("Test User");
    });

    it("should handle multiple roles in mergeUserData", () => {
      const jwtData = { id: "id", email: "e@e.com", role: "ORG_MEMBER" as const };
      const apiData = {
        role: ["ORG_MEMBER", "AUDITOR"],
      };

      const result = authMapper.mergeUserData(jwtData, apiData);

      expect(result.role).toBe("ORG_MEMBER"); // Primary
      expect(result.roles).toEqual(["ORG_MEMBER", "AUDITOR"]); // All
    });

    it("should map empty role list to ['SUPER_USER'] for superusers", () => {
      const jwtData = { id: "id", email: "e@e.com" };
      const apiData = {
        role: [],
      };

      const result = authMapper.mergeUserData(jwtData, apiData);

      expect(result.role).toBe("SUPER_USER");
      expect(result.roles).toEqual(["SUPER_USER"]);
    });

    it("should use JWT data when API data is missing", () => {
      const jwtData = {
        id: "jwt-id",
        email: "jwt@example.com",
        role: "ORG_MEMBER" as const,
        organization_id: "jwt-org",
      };

      const result = authMapper.mergeUserData(jwtData, undefined);

      expect(result.id).toBe("jwt-id");
      expect(result.email).toBe("jwt@example.com");
      expect(result.role).toBe("ORG_MEMBER");
      expect(result.organization_id).toBe("jwt-org");
    });

    it("should infer role from flags when role is missing", () => {
      const jwtData = {
        id: "jwt-id",
        email: "jwt@example.com",
        organization_id: "jwt-org",
      };

      const apiData = {
        is_superuser: true,
        is_staff: false,
      };

      const result = authMapper.mergeUserData(jwtData, apiData);

      expect(result.role).toBe("SUPER_USER");
    });
  });
});

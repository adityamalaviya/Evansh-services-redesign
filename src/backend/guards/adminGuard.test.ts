import { describe, it, expect } from "vitest";
import { isAdmin } from "./adminGuard";

describe("adminGuard - isAdmin", () => {
  it("returns true when userIsAdmin boolean flag is true", () => {
    expect(isAdmin(true)).toBe(true);
    expect(isAdmin(true, "random@user.com")).toBe(true);
  });

  it("returns true when email matches publicEnv.adminEmail case-insensitively with trimming", () => {
    // Note: vitest.setup.ts sets NEXT_PUBLIC_ADMIN_EMAIL = "admin@evansh.com"
    expect(isAdmin(false, "admin@evansh.com")).toBe(true);
    expect(isAdmin(false, "  ADMIN@EVANSH.COM  ")).toBe(true);
    expect(isAdmin(undefined, "admin@evansh.com")).toBe(true);
  });

  it("returns false when user is not admin and email does not match", () => {
    expect(isAdmin(false, "user@example.com")).toBe(false);
    expect(isAdmin(undefined, "user@example.com")).toBe(false);
  });

  it("returns false when email is empty or null or undefined", () => {
    expect(isAdmin(false, null)).toBe(false);
    expect(isAdmin(false, "")).toBe(false);
    expect(isAdmin(false, undefined)).toBe(false);
    expect(isAdmin(undefined, undefined)).toBe(false);
  });
});

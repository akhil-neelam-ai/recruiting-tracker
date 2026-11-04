import { describe, expect, it } from "vitest";
import { validateAuth } from "../lib/auth-fields";

const blank = { email: "", password: "", confirm: "" };

describe("validateAuth", () => {
  it("asks for an email and a password when both are empty", () => {
    expect(validateAuth(blank, "login")).toEqual({
      email: "Enter your email.",
      password: "Enter a password.",
    });
  });

  it("rejects an email without a domain", () => {
    expect(validateAuth({ ...blank, email: "akhil@", password: "secret" }, "login").email).toBe(
      "That email doesn't look right.",
    );
  });

  it("rejects a short password", () => {
    expect(validateAuth({ ...blank, email: "akhil@berkeley.edu", password: "short" }, "login").password).toBe(
      "Use at least 6 characters.",
    );
  });

  it("rejects a signup password that does not match", () => {
    expect(
      validateAuth(
        { email: "akhil@berkeley.edu", password: "secret1", confirm: "secret2" },
        "signup",
      ).confirm,
    ).toBe("Those passwords don't match.");
  });

  it("accepts a login with a normal email and a 6 character password", () => {
    expect(validateAuth({ email: " akhil@berkeley.edu ", password: "secret", confirm: "" }, "login")).toEqual(
      {},
    );
  });
});

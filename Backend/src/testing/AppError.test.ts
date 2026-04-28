import { describe, expect, it } from "vitest";
import { AppError } from "../errors/AppError";

describe("AppError", () => {
  it("creates an error with the provided message and status", () => {
    const err = new AppError("Not Found", 404);
    expect(err.message).toBe("Not Found");
    expect(err.status).toBe(404);
  });

  it("defaults status to 500 when none is provided", () => {
    const err = new AppError("Something went wrong");
    expect(err.status).toBe(500);
  });

  it("is an instance of Error", () => {
    const err = new AppError("Oops", 400);
    expect(err).toBeInstanceOf(Error);
  });

  it("is an instance of AppError", () => {
    const err = new AppError("Oops", 400);
    expect(err).toBeInstanceOf(AppError);
  });

  it("has name set to AppError", () => {
    const err = new AppError("Unauthorized", 401);
    expect(err.name).toBe("AppError");
  });

  it("can be distinguished from a plain Error via the name property", () => {
    const appErr = new AppError("Forbidden", 403);
    const plainErr = new Error("Forbidden");
    expect(appErr.name).toBe("AppError");
    expect(plainErr.name).toBe("Error");
  });

  it("stores the correct status for a 2xx success code", () => {
    const err = new AppError("Created", 201);
    expect(err.status).toBe(201);
  });
});

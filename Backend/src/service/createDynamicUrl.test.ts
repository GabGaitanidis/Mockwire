import { describe, expect, test, vi } from "vitest";

vi.mock("../repository/rules.repo", () => ({
  getEndpoint: vi.fn().mockResolvedValue("/users"),
  bindUrlToRule: vi.fn().mockResolvedValue({}),
}));

vi.mock("../repository/user.repo", () => ({
  getUsersAPIKey: vi.fn().mockResolvedValue("TESTKEY"),
}));

vi.mock("../data_generation/urlCreator", () => ({
  default: vi.fn().mockReturnValue("http://test-url"),
}));

vi.mock("../repository/url.repo", () => ({
  createDynamicUrl: vi
    .fn()
    .mockResolvedValue({ id: 123, url: "http://test-url" }),
}));

import createDynamicUrlService from "./createDynamicUrlService";
import { getEndpoint, bindUrlToRule } from "../repository/rules.repo";
import { getUsersAPIKey } from "../repository/user.repo";
import urlGenerator from "../data_generation/urlCreator";
import { createDynamicUrl } from "../repository/url.repo";

describe("createDynamicUrlService", () => {
  test("resolves URL creation using rulesId and userId", async () => {
    const output = await createDynamicUrlService(5, { ruleId: 99 });

    expect(getUsersAPIKey).toHaveBeenCalledWith(5);
    expect(getEndpoint).toHaveBeenCalledWith(5, 99);
    expect(urlGenerator).toHaveBeenCalledWith("TESTKEY", "/users");
    expect(createDynamicUrl).toHaveBeenCalledWith(5, "http://test-url", 99);
    expect(bindUrlToRule).toHaveBeenCalledWith(99, 123);
    expect(output).toEqual({ id: 123, url: "http://test-url" });
  });
});

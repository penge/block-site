import * as getBlockedUrl from "../get-blocked-url";

test("getBlockedUrl() returns blocked url", () => {
  jest.spyOn(getBlockedUrl, "__getBlockedHtmlUrl").mockReturnValue("/blocked.html");

  expect(getBlockedUrl.default({
    rule: "youtube.com",
  })).toBe("/blocked.html?rule=youtube.com");

  expect(getBlockedUrl.default({
    rule: "youtube.com",
    countParams: {
      count: 42,
      period: "ALL_TIME",
    },
  })).toBe("/blocked.html?rule=youtube.com&count=42");

  expect(getBlockedUrl.default({
    rule: "youtube.com",
    countParams: {
      count: 5,
      period: "TODAY",
    },
  })).toBe("/blocked.html?rule=youtube.com&count=5&period=TODAY");
});

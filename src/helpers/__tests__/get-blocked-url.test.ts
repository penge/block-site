import * as getBlockedUrl from "../get-blocked-url";

test("getBlockedUrl() returns blocked url", () => {
  jest.spyOn(getBlockedUrl, "__getBlockedHtmlUrl").mockReturnValue("/blocked.html");

  expect(getBlockedUrl.default({
    url: "http://youtube.com/",
    rule: "youtube.com",
  })).toBe("/blocked.html?url=http%3A%2F%2Fyoutube.com%2F&rule=youtube.com");

  expect(getBlockedUrl.default({
    url: "http://youtube.com/",
    rule: "youtube.com",
    countParams: {
      count: 42,
      period: "ALL_TIME",
    },
  })).toBe("/blocked.html?url=http%3A%2F%2Fyoutube.com%2F&rule=youtube.com&count=42&period=ALL_TIME");

  expect(getBlockedUrl.default({
    url: "http://youtube.com/",
    rule: "youtube.com",
    countParams: {
      count: 5,
      period: "TODAY",
    },
  })).toBe("/blocked.html?url=http%3A%2F%2Fyoutube.com%2F&rule=youtube.com&count=5&period=TODAY");
});

import normalizeUrl from "../normalize-url";

describe("normalizeUrl()", () => {
  it("removes https, http, www", () => {
    [
      "https://example.com/",
      "http://example.com/",

      "https://www.example.com/",
      "http://www.example.com/",
    ].forEach((url) => expect(normalizeUrl(url)).toBe("example.com/"));

    [
      "https://dashboard.example.com/",
      "http://dashboard.example.com/",

      "https://www.dashboard.example.com/",
      "http://www.dashboard.example.com/",
    ].forEach((url) => expect(normalizeUrl(url)).toBe("dashboard.example.com/"));
  });

  it("keeps path unchanged", () => {
    expect(normalizeUrl("https://example.com/apple/projects/1?tab=analytics#charts")).toBe(
      "example.com/apple/projects/1?tab=analytics#charts",
    );

    expect(normalizeUrl("https://example.com/apple/projects/1")).toBe(
      "example.com/apple/projects/1",
    );

    expect(normalizeUrl("https://example.com/apple/projects/")).toBe(
      "example.com/apple/projects/",
    );
  });
});

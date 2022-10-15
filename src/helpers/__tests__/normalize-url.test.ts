import normalizeUrl from "../normalize-url";

test("normalizeUrl()", () => {
  expect(normalizeUrl("https://www.youtube.com/")).toBe("youtube.com");

  expect(normalizeUrl("https://www.youtube.com/feed/explore")).toBe("youtube.com/feed/explore");

  expect(normalizeUrl("https://music.youtube.com/")).toBe("music.youtube.com");

  expect(normalizeUrl("https://music.youtube.com/explore")).toBe("music.youtube.com/explore");
});

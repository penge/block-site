import { flushObsoleteEntries, add } from "../counter";

describe("flushObsoleteEntries()", () => {
  const blocked = ["youtube.com", "!music.youtube.com"];
  const counter = {
    "music.youtube.com": [3000, 9000],
    "youtube.com": [5000, 6000],
    "something.com": [1000, 2000],
  };

  it("updates counter", () => {
    flushObsoleteEntries({ blocked, counter });
    expect(counter).toEqual({
      "youtube.com": [5000, 6000],
    });

    flushObsoleteEntries({ blocked: [], counter });
    expect(counter).toEqual({});
  });
});

describe("add()", () => {
  describe("empty", () => {
    const counter = {};

    it("returns updated count", () => {
      expect(
        add("youtube.com", 5000, { counter })
      ).toBe(1);
    });

    it("updates counter", () => {
      expect(counter).toEqual({ "youtube.com": [5000] });
    });
  });

  describe("non-empty", () => {
    const counter = {
      "youtube.com": [5000, 6000, 7000],
      "something.com": [3000],
    };

    it("returns updated count", () => {
      expect(
        add("youtube.com", 8000, { counter })
      ).toBe(4);

      expect(
        add("something.com", 9000, { counter })
      ).toBe(2);
    });

    it("updates counter", () => {
      expect(counter).toEqual({
        "youtube.com": [5000, 6000, 7000, 8000],
        "something.com": [3000, 9000],
      });
    });
  });
});

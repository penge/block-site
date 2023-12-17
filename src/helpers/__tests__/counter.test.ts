import * as c from "../counter";

describe("flushObsoleteEntries()", () => {
  const blocked = ["youtube.com", "!music.youtube.com"];
  const counter = {
    "music.youtube.com": [3000, 9000],
    "youtube.com": [5000, 6000],
    "something.com": [1000, 2000],
  };

  it("updates counter", () => {
    c.flushObsoleteEntries({ blocked, counter });
    expect(counter).toEqual({
      "youtube.com": [5000, 6000],
    });

    c.flushObsoleteEntries({ blocked: [], counter });
    expect(counter).toEqual({});
  });
});

describe("counterPeriodToTimeStamp()", () => {
  it("converts counter period to timestamp", () => {
    const now = 1667160846000; // Sun Oct 30 2022 20:14:06 UTC

    expect(c.counterPeriodToTimeStamp("ALL_TIME", 0)).toBe(0);
    expect(c.counterPeriodToTimeStamp("ALL_TIME", now)).toBe(0); // now is not relevant

    expect(c.counterPeriodToTimeStamp("THIS_MONTH", now)).toBe(1664582400000); // Sat Oct 01 2022 00:00:00 UTC
    expect(c.counterPeriodToTimeStamp("THIS_WEEK", now)).toBe(1666569600000); // Mon Oct 24 2022 00:00:00 UTC
    expect(c.counterPeriodToTimeStamp("TODAY", now)).toBe(1667088000000); // Sun Oct 30 2022 00:00:00 UTC
  });
});

describe("add()", () => {
  describe("empty", () => {
    const counter = {};

    it("returns updated count", () => {
      expect(
        c.add("youtube.com", 5000, { counter, countFromTimeStamp: 0 }),
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
        c.add("youtube.com", 8000, { counter, countFromTimeStamp: 0 }),
      ).toBe(4);

      expect(
        c.add("something.com", 9000, { counter, countFromTimeStamp: 0 }),
      ).toBe(2);
    });

    it("updates counter", () => {
      expect(counter).toEqual({
        "youtube.com": [5000, 6000, 7000, 8000],
        "something.com": [3000, 9000],
      });
    });
  });

  describe("count since some time", () => {
    it("returns count since specified time", () => {
      const counter = {
        "youtube.com": [5000, 6000, 7000, 8000, 9000, 10000, 11000],
      };

      expect(
        c.add("youtube.com", 20000, { counter, countFromTimeStamp: 0 }),
      ).toBe(8);

      expect(
        c.add("youtube.com", 21000, { counter, countFromTimeStamp: 10000 }),
      ).toBe(4);
    });
  });
});

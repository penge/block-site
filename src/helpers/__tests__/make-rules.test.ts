import makeRules, { Rule } from "../make-rules";

test("makeRules() - backward compatibility", () => {
  expect(
    makeRules([
      "www.facebook.com",
      "https://www.instagram.com/",

      "*.youtube.com",
      "!music.youtube.com",

      "reddit.com",
      "!reddit.com/r/MachineLearning",
    ]),
  ).toEqual<Rule[]>([
    { type: "allow", path: "music.youtube.com", schedules: null },
    { type: "allow", path: "reddit.com/r/MachineLearning", schedules: null },

    { type: "block", path: "www.facebook.com", schedules: null },
    { type: "block", path: "www.instagram.com/", schedules: null },

    { type: "block", path: "*.youtube.com", schedules: null },
    { type: "block", path: "reddit.com", schedules: null },
  ]);
});

test("makeRules() - with time intervals", () => {
  expect(
    makeRules([
      "example.com 9:00-17:00",
      "facebook.com Mon-Fri 9:00-17:00",
      "youtube.com Sat-Sun",
      "reddit.com",
    ]),
  ).toEqual<Rule[]>([
    {
      type: "block",
      path: "example.com",
      schedules: [{
        days: null,
        timeRanges: [{ start: "9:00", end: "17:00" }],
      }],
    },
    {
      type: "block",
      path: "facebook.com",
      schedules: [{
        days: [1, 2, 3, 4, 5],
        timeRanges: [{ start: "9:00", end: "17:00" }],
      }],
    },
    {
      type: "block",
      path: "youtube.com",
      schedules: [{
        days: [6, 0],
        timeRanges: null,
      }],
    },
    {
      type: "block",
      path: "reddit.com",
      schedules: null,
    },
  ]);
});

test("makeRules() - with comments", () => {
  expect(
    makeRules([
      "example.com 9:00-17:00 # work hours",
      "facebook.com # blocked all day",
    ]),
  ).toEqual<Rule[]>([
    {
      type: "block",
      path: "example.com",
      schedules: [{
        days: null,
        timeRanges: [{ start: "9:00", end: "17:00" }],
      }],
    },
    {
      type: "block",
      path: "facebook.com",
      schedules: null,
    },
  ]);
});

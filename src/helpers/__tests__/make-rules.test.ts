import makeRules, { Rule } from "../make-rules";

test("makeRules()", () => {
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
    { type: "allow", path: "music.youtube.com" },
    { type: "allow", path: "reddit.com/r/MachineLearning" },

    { type: "block", path: "www.facebook.com" },
    { type: "block", path: "www.instagram.com/" },

    { type: "block", path: "*.youtube.com" },
    { type: "block", path: "reddit.com" },
  ]);
});

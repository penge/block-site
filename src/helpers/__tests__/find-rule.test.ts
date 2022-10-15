import findRule from "../find-rule";
import { Rule } from "../make-rules";

test("findRule()", () => {
  expect(findRule("https://www.youtube.com/", [])).toBe(undefined);
  expect(findRule("https://www.youtube.com/", ["something.com"])).toBe(undefined);
  expect(findRule("https://music.youtube.com/", ["youtube.com", "!music.youtube.com"])).toEqual<Rule>({
    path: "music.youtube.com",
    type: "allow",
  });

  expect(findRule("https://www.youtube.com/", ["youtube.com"])).toEqual<Rule>({
    path: "youtube.com",
    type: "block",
  });
});

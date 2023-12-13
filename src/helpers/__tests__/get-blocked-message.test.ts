import getBlockedMessage from "../get-blocked-message";

test("getBlockedMessage() returns blocked message", () => {
  expect(getBlockedMessage({
    url: "http://youtube.com/",
    rule: "youtube.com",
  })).toBe('<span id="url">http://youtube.com/</span> <b>was blocked</b> by rule <span id="rule">youtube.com</span>');

  expect(getBlockedMessage({
    url: "http://youtube.com/",
    rule: "youtube.com",
    countParams: {
      count: 42,
      period: "ALL_TIME",
    },
  })).toBe('<span id="url">http://youtube.com/</span> <b>was blocked</b> (42x overall) by rule <span id="rule">youtube.com</span>');

  expect(getBlockedMessage({
    url: "http://youtube.com/",
    rule: "youtube.com",
    countParams: {
      count: 5,
      period: "TODAY",
    },
  })).toBe('<span id="url">http://youtube.com/</span> <b>was blocked</b> (5x today) by rule <span id="rule">youtube.com</span>');

  expect(getBlockedMessage({
    url: "http://youtube.com/",
    rule: "youtube.com",
    countParams: {
      count: 12,
      period: "THIS_WEEK",
    },
  })).toBe('<span id="url">http://youtube.com/</span> <b>was blocked</b> (12x this week) by rule <span id="rule">youtube.com</span>');

  expect(getBlockedMessage({
    url: "http://youtube.com/",
    rule: "youtube.com",
    countParams: {
      count: 38,
      period: "THIS_MONTH",
    },
  })).toBe('<span id="url">http://youtube.com/</span> <b>was blocked</b> (38x this month) by rule <span id="rule">youtube.com</span>');
});

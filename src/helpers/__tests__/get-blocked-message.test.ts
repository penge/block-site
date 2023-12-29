import getBlockedMessage from "../get-blocked-message";

test("getBlockedMessage() returns blocked message", () => {
  expect(getBlockedMessage({
    url: "http://youtube.com/",
    rule: "youtube.com",
  })).toBe('<span id="url">http://youtube.com/</span> <b>was blocked</b> by <span id="rule">youtube.com</span>');

  expect(getBlockedMessage({
    url: "http://youtube.com/",
    rule: "youtube.com",
    countParams: {
      count: 42,
      period: "ALL_TIME",
    },
  })).toBe('<span id="url">http://youtube.com/</span> <b>was blocked</b> by <span id="rule">youtube.com</span> (42x overall)');

  expect(getBlockedMessage({
    url: "http://youtube.com/",
    rule: "youtube.com",
    countParams: {
      count: 5,
      period: "TODAY",
    },
  })).toBe('<span id="url">http://youtube.com/</span> <b>was blocked</b> by <span id="rule">youtube.com</span> (5x today)');

  expect(getBlockedMessage({
    url: "http://youtube.com/",
    rule: "youtube.com",
    countParams: {
      count: 12,
      period: "THIS_WEEK",
    },
  })).toBe('<span id="url">http://youtube.com/</span> <b>was blocked</b> by <span id="rule">youtube.com</span> (12x this week)');

  expect(getBlockedMessage({
    url: "http://youtube.com/",
    rule: "youtube.com",
    countParams: {
      count: 38,
      period: "THIS_MONTH",
    },
  })).toBe('<span id="url">http://youtube.com/</span> <b>was blocked</b> by <span id="rule">youtube.com</span> (38x this month)');
});

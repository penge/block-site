import getBlockedMessage from "../get-blocked-message";

test("getBlockedMessage() returns blocked message", () => {
  expect(getBlockedMessage({
    rule: "youtube.com",
  })).toBe('<span id="rule">youtube.com</span> was blocked.');

  expect(getBlockedMessage({
    rule: "youtube.com",
    count: "42",
  })).toBe('<span id="rule">youtube.com</span> was blocked <span id="count">42x</span>.');

  expect(getBlockedMessage({
    rule: "youtube.com",
    count: "42",
    period: "ALL_TIME",
  })).toBe('<span id="rule">youtube.com</span> was blocked <span id="count">42x</span>.'); // ALL_TIME not part of the message

  expect(getBlockedMessage({
    rule: "youtube.com",
    count: "5",
    period: "TODAY",
  })).toBe('<span id="rule">youtube.com</span> was blocked <span id="count">5x</span> <span id="period">today</span>.');

  expect(getBlockedMessage({
    rule: "youtube.com",
    count: "12",
    period: "THIS_WEEK",
  })).toBe('<span id="rule">youtube.com</span> was blocked <span id="count">12x</span> <span id="period">this week</span>.');

  expect(getBlockedMessage({
    rule: "youtube.com",
    count: "38",
    period: "THIS_MONTH",
  })).toBe('<span id="rule">youtube.com</span> was blocked <span id="count">38x</span> <span id="period">this month</span>.');
});

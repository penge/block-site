import { CounterPeriod } from "../storage";
import { GetBlockedUrlParams } from "./get-blocked-url";

const periodStrings: Record<CounterPeriod, string> = {
  ALL_TIME: "overall",
  THIS_MONTH: "this month",
  THIS_WEEK: "this week",
  TODAY: "today",
};

export default ({ url, rule, countParams: cp }: GetBlockedUrlParams): string =>
  `<span id="url">${url}</span> <b>was blocked</b> by <span id="rule">${rule}</span>`
  + (cp ? ` (${cp.count}x ${periodStrings[cp.period]})` : "");

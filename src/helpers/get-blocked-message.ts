import { CounterPeriod } from "../storage";
import { GetBlockedUrlParams } from "./get-blocked-url";

const periodStrings: Record<CounterPeriod, string> = {
  "ALL_TIME": "overall",
  "THIS_MONTH": "this month",
  "THIS_WEEK": "this week",
  "TODAY": "today",
};

export default ({ url, rule, countParams: cp }: GetBlockedUrlParams): string => cp
  ? `<span id="url">${url}</span> <b>was blocked</b> (${cp.count}x ${periodStrings[cp.period]}) by rule <span id="rule">${rule}</span>`
  : `<span id="url">${url}</span> <b>was blocked</b> by rule <span id="rule">${rule}</span>`;

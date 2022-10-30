import { CounterPeriod } from "../storage";

const periodStrings: Record<CounterPeriod, string> = {
  "ALL_TIME": "",
  "THIS_MONTH": "this month",
  "THIS_WEEK": "this week",
  "TODAY": "today",
};

interface GetBlockedMessageParams {
  rule: string
  count?: string
  period?: CounterPeriod
}

export default ({ rule, count, period }: GetBlockedMessageParams): string => {
  const periodString: string = period ? periodStrings[period] : "";
  return count
    ? `<span id="rule">${rule}</span> was blocked <span id="count">${count}x</span>${periodString ? ` <span id="period">${periodString}</span>` : ""}.`
    : `<span id="rule">${rule}</span> was blocked.`;
};

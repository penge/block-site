import { CounterPeriod } from "../storage";

export const __getBlockedHtmlUrl = () => chrome.runtime.getURL("blocked.html");

interface GetBlockedUrlParams {
  rule: string
  countParams?: {
    count: number
    period: CounterPeriod
  }
}

export default ({ rule, countParams }: GetBlockedUrlParams): string => {
  const params = new URLSearchParams({ rule });
  if (countParams) {
    params.append("count", countParams.count.toString());
    if (countParams.period !== "ALL_TIME") {
      params.append("period", countParams.period);
    }
  }

  return `${__getBlockedHtmlUrl()}?${params.toString()}`;
};

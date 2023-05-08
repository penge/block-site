import { CounterPeriod } from "../storage";

export const __getBlockedHtmlUrl = () => chrome.runtime.getURL("blocked.html");

export interface GetBlockedUrlParams {
  url: string
  rule: string
  countParams?: {
    count: number
    period: CounterPeriod
  }
}

export default ({ url, rule, countParams }: GetBlockedUrlParams): string => {
  const params = new URLSearchParams({ url, rule });
  if (countParams) {
    params.append("count", countParams.count.toString());
    params.append("period", countParams.period);
  }

  return `${__getBlockedHtmlUrl()}?${params.toString()}`;
};

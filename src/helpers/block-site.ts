import storage from "../storage";
import findRule from "./find-rule";
import * as counterHelper from "./counter";
import getBlockedUrl from "./get-blocked-url";
import { isWithinSchedule } from "./check-schedule";

interface BlockSiteOptions {
  blocked: string[]
  tabId: number
  url: string
}

export default (options: BlockSiteOptions) => {
  const { blocked, tabId, url } = options;
  if (!blocked.length || !tabId || !url.startsWith("http")) {
    return;
  }

  const foundRule = findRule(url, blocked);
  if (!foundRule || foundRule.type === "allow") {
    storage.get(["counter"]).then(({ counter }) => {
      counterHelper.flushObsoleteEntries({ blocked, counter });
      storage.set({ counter });
    });
    return;
  }

  // Check if current time is within the blocking schedules
  if (!isWithinSchedule(foundRule.schedules)) {
    // Outside schedule - don't block
    return;
  }

  storage.get(["counter", "counterShow", "counterPeriod", "resolution"]).then(({ counter, counterShow, counterPeriod, resolution }) => {
    counterHelper.flushObsoleteEntries({ blocked, counter });

    const timeStamp = Date.now();
    const count = counterHelper.add(foundRule.path, timeStamp, {
      counter,
      countFromTimeStamp: counterHelper.counterPeriodToTimeStamp(counterPeriod, new Date().getTime()),
    });
    storage.set({ counter });

    switch (resolution) {
    case "CLOSE_TAB":
      chrome.tabs.remove(tabId);
      break;
    case "SHOW_BLOCKED_INFO_PAGE": {
      const commonUpdateProperties = {
        url: getBlockedUrl({
          url,
          rule: foundRule.path,
          countParams: counterShow ? { count, period: counterPeriod } : undefined,
        }),
      };

      if (process.env.TARGET === "chrome") {
        chrome.tabs.update(tabId, commonUpdateProperties);
        break;
      }

      if (process.env.TARGET === "firefox") {
        browser.tabs.update(tabId, { ...commonUpdateProperties, loadReplace: true });
        break;
      }
    }}
  });
};

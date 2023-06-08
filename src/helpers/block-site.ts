import storage from "../storage";
import findRule from "./find-rule";
import * as counterHelper from "./counter";
import getBlockedUrl from "./get-blocked-url";

interface BlockSiteOptions {
  tabId: number
  url: string
  timeStamp: number
}

export default (options: BlockSiteOptions) => {
  const { tabId, url, timeStamp } = options;

  storage.get(["enabled", "blocked"], ({ enabled, blocked }) => {
    if (!enabled || blocked.length === 0) {
      return;
    }

    const foundRule = findRule(url, blocked);
    if (!foundRule || foundRule.type === "allow") {
      storage.get(["counter"], ({ counter }) => {
        counterHelper.flushObsoleteEntries({ blocked, counter });
        storage.set({ counter });
      });
      return;
    }

    storage.get(["counter", "counterShow", "counterPeriod", "resolution"], ({ counter, counterShow, counterPeriod, resolution }) => {
      counterHelper.flushObsoleteEntries({ blocked, counter });
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
        chrome.tabs.update(tabId, {
          url: getBlockedUrl({
            url,
            rule: foundRule.path,
            countParams: counterShow ? { count, period: counterPeriod } : undefined },
          )},
        );
        break;
      }}
    });
  });
};

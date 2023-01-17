import initStorage from "./storage/init";
import storage from "./storage";
import findRule from "./helpers/find-rule";
import * as counterHelper from "./helpers/counter";
import getBlockedUrl from "./helpers/get-blocked-url";

chrome.runtime.onInstalled.addListener(() => {
  initStorage();
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const { tabId, url, timeStamp, frameId } = details;
  if (!url || !url.startsWith("http") || frameId !== 0) {
    return;
  }

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
            rule: foundRule.path,
            countParams: counterShow ? { count, period: counterPeriod } : undefined },
          )},
        );
        break;
      }}
    });
  });
});

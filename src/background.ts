import storage, { Schema } from "./helpers/storage";
import findRule from "./helpers/find-rule";
import * as counterHelper from "./helpers/counter";

const CLOSE_TAB = "CLOSE_TAB";
const SHOW_BLOCKED_INFO_PAGE = "SHOW_BLOCKED_INFO_PAGE";

const RESOLUTIONS = [
  CLOSE_TAB,
  SHOW_BLOCKED_INFO_PAGE,
];

chrome.runtime.onInstalled.addListener(() => {
  storage.get(["enabled", "blocked", "counter", "resolution"], (local) => {
    if (typeof local.enabled !== "boolean") {
      storage.set<Pick<Schema, "enabled">>({ enabled: false });
    }

    if (!Array.isArray(local.blocked)) {
      storage.set<Pick<Schema, "blocked">>({ blocked: [] });
    }

    if (typeof local.counter !== "object") {
      storage.set<Pick<Schema, "counter">>({ counter: {} });
    }

    if (!RESOLUTIONS.includes(local.resolution)) {
      storage.set<Pick<Schema, "resolution">>({ resolution: CLOSE_TAB });
    }
  });
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const { tabId, url, timeStamp } = details;
  if (!url || !url.startsWith("http") || details.frameId !== 0) {
    return;
  }

  storage.get(["enabled", "blocked", "counter", "resolution"], (local) => {
    const { enabled, blocked, counter, resolution } = local;
    if (!enabled || blocked.length === 0 || !RESOLUTIONS.includes(resolution)) {
      return;
    }

    counterHelper.flushObsoleteEntries({ blocked, counter });

    const foundRule = findRule(url, blocked);
    if (!foundRule || foundRule.type === "allow") {
      storage.set<Pick<Schema, "counter">>({ counter });
      return;
    }

    const count = counterHelper.add(foundRule.path, timeStamp, { counter });
    storage.set<Pick<Schema, "counter">>({ counter });

    switch (resolution) {
    case CLOSE_TAB:
      chrome.tabs.remove(tabId);
      break;
    case SHOW_BLOCKED_INFO_PAGE:
      chrome.tabs.update(tabId, { url: `${chrome.runtime.getURL("blocked.html")}?url=${url}&count=${count}` });
      break;
    }
  });
});

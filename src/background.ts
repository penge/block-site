import findRule from "./helpers/find-rule";

const CLOSE_TAB = "CLOSE_TAB";
const SHOW_BLOCKED_INFO_PAGE = "SHOW_BLOCKED_INFO_PAGE";

const RESOLUTIONS = [
  CLOSE_TAB,
  SHOW_BLOCKED_INFO_PAGE,
];

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.get(["enabled", "blocked", "resolution"], function (local) {
    if (typeof local.enabled !== "boolean") {
      chrome.storage.local.set({ enabled: false });
    }

    if (!Array.isArray(local.blocked)) {
      chrome.storage.local.set({ blocked: [] });
    }

    if (!RESOLUTIONS.includes(local.resolution)) {
      chrome.storage.local.set({ resolution: CLOSE_TAB });
    }
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  const { url } = changeInfo;
  if (!url || !url.startsWith("http")) {
    return;
  }

  chrome.storage.local.get(["enabled", "blocked", "resolution"], function (local) {
    const { enabled, blocked, resolution } = local;
    if (!enabled || !Array.isArray(blocked) || blocked.length === 0 || !RESOLUTIONS.includes(resolution)) {
      return;
    }

    const foundRule = findRule(url, blocked);
    if (!foundRule || foundRule.type === "allow") {
      return;
    }

    switch (resolution) {
    case CLOSE_TAB:
      chrome.tabs.remove(tabId);
      break;
    case SHOW_BLOCKED_INFO_PAGE:
      chrome.tabs.update(tabId, { url: `${chrome.runtime.getURL("blocked.html")}?url=${url}` });
      break;
    }
  });
});

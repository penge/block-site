"use strict";

/* global chrome, URL */

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.get(["blocked", "enabled"], function (local) {
    if (!Array.isArray(local.blocked)) {
      chrome.storage.local.set({ blocked: [] });
    }

    if (typeof local.enabled !== "boolean") {
      chrome.storage.local.set({ enabled: false });
    }
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  const url = changeInfo.pendingUrl || changeInfo.url;
  if (!url || !url.startsWith("http")) {
    return;
  }

  const hostname = new URL(url).hostname;

  chrome.storage.local.get(["blocked", "enabled"], function (local) {
    const { blocked, enabled } = local;
    if (!Array.isArray(blocked) || !enabled) {
      return;
    }

    const allowList = blocked
      .filter((item) => item.startsWith("!"))
      .map((hostname) => hostname.substring(1));

    const blockList = blocked.filter((item) => !item.startsWith("!"));

    if (allowList.find((domain) => hostname === domain)) {
      return;
    } else if (blockList.find((domain) => hostname.includes(domain))) {
      chrome.tabs.remove(tabId);
    }
  });
});

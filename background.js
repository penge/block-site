"use strict";

/* global chrome */
/* global URL */

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({
    enabled: true,
    blocked: [
      "facebook.com",
      "instagram.com",
      "youtube.com",
      "twitter.com",
      "reddit.com"
    ],
    tabs: {}
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (!tabId || !changeInfo.url || !changeInfo.url.startsWith("http")) {
    return;
  }

  chrome.storage.sync.get(["enabled", "tabs"], function (result) {
    // Store the tab
    try {
      result.tabs[tabId] = new URL(changeInfo.url).hostname;
      chrome.storage.sync.set({ "tabs": result.tabs }, function () {
        if (result.enabled) {
          chrome.extension.getBackgroundPage().removeTabs();
        }
      });
    }
    catch (err) { return err; }
  });
});

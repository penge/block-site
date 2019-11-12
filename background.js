'use strict';

/* global chrome */

var blocked = [
  'facebook.com',
  'instagram.com',
  'youtube.com',
  'twitter.com',
  'reddit.com'
];

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ 'blocked': blocked }, undefined);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!changeInfo || !changeInfo.url) {
    return;
  }

  chrome.storage.sync.get(['blocked'], function (result) {
    var toBlock = result.blocked.some(url => changeInfo.url.includes(url));
    if (toBlock) {
      chrome.tabs.remove(tabId, undefined);
    }
  });
});

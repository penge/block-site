'use strict';

/* global chrome */
chrome.runtime.onInstalled.addListener(function() {
   var blocked = [
     'facebook.com',
     'instagram.com',
     'youtube.com',
     'twitter.com',
     'reddit.com'
   ];

   chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
     if (!changeInfo || !changeInfo.url) {
       return;
     }

     var toBlock = blocked.some(url => changeInfo.url.includes(url));
     if (toBlock) {
       chrome.tabs.remove(tabId, undefined);
     }
   });
});


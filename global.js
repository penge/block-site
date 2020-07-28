"use strict";

/* global chrome, console */

// eslint-disable-next-line no-unused-vars
function removeTabs() {
  chrome.storage.local.get(["blocked", "tabs"], function (result) {

    // Iterate over blocked domains
    result.blocked.forEach(function (domain) {

      // Check if opened tabs are from blocked domains
      Object.keys(result.tabs).forEach(function (tabId) {

        // Delete the tab
        if (result.tabs[tabId].includes(domain)) {
          var parsed = parseInt(tabId, 10);

          chrome.tabs.remove(parsed, function () {
            if (chrome.runtime.lastError) {
              // Chill (Tab does not exist, it was closed manually before the extension was re-enabled.)
              console.log("Tab " + parsed + " (" + domain + ") " + "does not exist!");
            }
            delete result.tabs[parsed];
            chrome.storage.local.set({ "tabs": result.tabs });
          });
        }
      });
    });
  });
}

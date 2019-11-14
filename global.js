'use strict';

/* global chrome */


function removeTabs() {
  chrome.storage.sync.get(['blocked', 'tabs'], function (result) {

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
              console.log('Tab ' + parsed + ' (' + domain + ') ' + 'does not exist!');
            }
            delete result.tabs[parsed];
            chrome.storage.sync.set({ 'tabs': result.tabs });
          });
        }
      });
    });
  });
}

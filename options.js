'use strict';

/* global chrome */

var textarea = document.getElementById('textarea');

chrome.storage.sync.get(['blocked'], function (result) {
  var blocked = result.blocked;
  var value = blocked.join('\r\n');
  textarea.value = value;
});

document.getElementById('save').addEventListener('click', function () {
  var blocked = textarea.value.split('\n').filter(function(string) {
    return string.length > 0;
  });
  chrome.storage.sync.set({ 'blocked': blocked }, function () {
    chrome.storage.sync.get(['enabled'], function (result) {
      if (result.enabled) {
        chrome.extension.getBackgroundPage().removeTabs();
      }
    });
  });
});

document.getElementById('checkbox').addEventListener('change', function (event) {
  var enabled = event.target.checked;
  chrome.storage.sync.set({ 'enabled': enabled }, function () {
    if (enabled) {
      chrome.extension.getBackgroundPage().removeTabs();
    }
  });
});

"use strict";

/* global chrome, document */

var textarea = document.getElementById("textarea");
var checkbox = document.getElementById("checkbox");

chrome.storage.local.get(["blocked", "enabled"], function (result) {
  // blocked
  var blocked = result.blocked;
  var value = blocked.join("\r\n");
  textarea.value = value;

  // enabled
  checkbox.checked = result.enabled;
});

document.getElementById("save").addEventListener("click", function () {
  var blocked = textarea.value.split("\n").filter(function(string) {
    return string.length > 0;
  });
  chrome.storage.local.set({ "blocked": blocked }, function () {
    chrome.storage.local.get(["enabled"], function (result) {
      if (result.enabled) {
        chrome.extension.getBackgroundPage().removeTabs();
      }
    });
  });
});

document.getElementById("checkbox").addEventListener("change", function (event) {
  var enabled = event.target.checked;
  chrome.storage.local.set({ "enabled": enabled }, function () {
    if (enabled) {
      chrome.extension.getBackgroundPage().removeTabs();
    }
  });
});

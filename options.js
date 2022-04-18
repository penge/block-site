"use strict";

/* global chrome, window, document */

const blockedList = document.getElementById("blocked-list");
const resolutionSelect = document.getElementById("resolution-select");
const enabledToggle = document.getElementById("enabled-toggle");

blockedList.placeholder = [
  "facebook.com",
  "instagram.com",
  "youtube.com",
  "!music.youtube.com",
  "twitter.com",
  "reddit.com",
  "!reddit.com/r/MachineLearning",
].join("\n");

blockedList.addEventListener("change", (event) => {
  const blocked = event.target.value.split("\n").map(s => s.trim()).filter(Boolean);

  chrome.storage.local.set({ blocked });
});

resolutionSelect.addEventListener("change", (event) => {
  const resolution = event.target.value;

  chrome.storage.local.set({ resolution });
});

enabledToggle.addEventListener("change", (event) => {
  const enabled = event.target.checked;

  chrome.storage.local.set({ enabled });
});

window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["enabled", "blocked", "resolution"], function (local) {
    const { enabled, blocked, resolution } = local;
    if (!Array.isArray(blocked)) {
      return;
    }

    // blocked
    var value = blocked.join("\r\n"); // display every blocked in new line
    blockedList.value = value;

    // resolution
    resolutionSelect.value = resolution;

    // enabled
    enabledToggle.checked = enabled;

    // UI ready
    document.body.classList.add("ready");
  });
});

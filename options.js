"use strict";

/* global chrome, window, document */

const textarea = document.getElementById("textarea");
const save = document.getElementById("save");
const notif = document.getElementById("notif");

textarea.placeholder = [
  "facebook.com",
  "instagram.com",
  "youtube.com",
  "twitter.com",
  "reddit.com",
].join("\n");

save.addEventListener("click", () => {
  const blocked = textarea.value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  
    notif.style.display = "none";
    notif.style.display = "block";

  chrome.storage.local.set({ blocked });
});

window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["blocked", "enabled"], function (local) {
    const { blocked, enabled } = local;
    if (!Array.isArray(blocked)) {
      return;
    }
    // init css
    notif.style.display = "none";

    // blocked
    var value = blocked.join("\r\n"); // display every blocked in new line
    textarea.value = value;

    // show controls
    document.body.classList.add("ready");
  });
});

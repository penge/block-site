const blockedList = document.getElementById("blocked-list") as HTMLTextAreaElement;
const resolutionSelect = document.getElementById("resolution-select") as HTMLSelectElement;
const enabledToggle = document.getElementById("enabled-toggle") as HTMLInputElement;

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
  const blocked = (event.target as HTMLTextAreaElement).value.split("\n").map(s => s.trim()).filter(Boolean);

  chrome.storage.local.set({ blocked });
});

resolutionSelect.addEventListener("change", (event) => {
  const resolution = (event.target as HTMLSelectElement).value;

  chrome.storage.local.set({ resolution });
});

enabledToggle.addEventListener("change", (event) => {
  const enabled = (event.target as HTMLInputElement).checked;

  chrome.storage.local.set({ enabled });
});

window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["enabled", "blocked", "resolution"], function (local) {
    const { enabled, blocked, resolution } = local;
    if (!Array.isArray(blocked)) {
      return;
    }

    // blocked
    const value = (blocked as string[]).join("\r\n"); // display every blocked in new line
    blockedList.value = value;

    // resolution
    resolutionSelect.value = resolution;

    // enabled
    enabledToggle.checked = enabled;

    // UI ready
    document.body.classList.add("ready");
  });
});

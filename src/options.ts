import storage, { Schema } from "./helpers/storage";

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
  const blocked = (event.target as HTMLTextAreaElement).value.split("\n").map((s) => s.trim()).filter(Boolean);

  storage.set<Pick<Schema, "blocked">>({ blocked });
});

resolutionSelect.addEventListener("change", (event) => {
  const resolution = (event.target as HTMLSelectElement).value;

  storage.set<Pick<Schema, "resolution">>({ resolution });
});

enabledToggle.addEventListener("change", (event) => {
  const enabled = (event.target as HTMLInputElement).checked;

  storage.set<Pick<Schema, "enabled">>({ enabled });
});

window.addEventListener("DOMContentLoaded", () => {
  storage.get(["enabled", "blocked", "resolution"], (local) => {
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

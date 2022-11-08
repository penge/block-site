import storage, { Schema, Resolution, CounterPeriod, RESOLUTIONS } from "./storage";

const UI = (() => {
  const elements = {
    blockedList: document.getElementById("blocked-list") as HTMLTextAreaElement,
    enabled: document.getElementById("enabled") as HTMLSelectElement,
    resolution: document.getElementById("resolution") as HTMLSelectElement,
    counterShow: document.getElementById("counter-show") as HTMLSelectElement,
    counterPeriod: document.getElementById("counter-period") as HTMLSelectElement,
  };

  elements.blockedList.placeholder = [
    "facebook.com",
    "instagram.com",
    "youtube.com",
    "!music.youtube.com",
    "twitter.com",
    "reddit.com",
    "!reddit.com/r/MachineLearning",
  ].join("\n");

  const booleanToString = (b: boolean) => b ? "YES" : "NO";
  const stringToBoolean = (s: string) => s === "YES";

  const getEventTargetValue = (event: Event) => (event.target as HTMLTextAreaElement | HTMLSelectElement).value;

  elements.blockedList.addEventListener("input", (event) => {
    const blocked = getEventTargetValue(event).split("\n").map((s) => s.trim()).filter(Boolean);
    storage.set<Pick<Schema, "blocked">>({ blocked });
  });

  elements.enabled.addEventListener("change", (event) => {
    const enabled = stringToBoolean(getEventTargetValue(event));
    storage.set<Pick<Schema, "enabled">>({ enabled });
  });

  elements.resolution.addEventListener("change", (event) => {
    const resolution = getEventTargetValue(event) as Resolution;
    storage.set<Pick<Schema, "resolution">>({ resolution });
  });

  elements.counterShow.addEventListener("change", (event) => {
    const counterShow = stringToBoolean(getEventTargetValue(event));
    storage.set<Pick<Schema, "counterShow">>({ counterShow });
  });

  elements.counterPeriod.addEventListener("change", (event) => {
    const counterPeriod = getEventTargetValue(event) as CounterPeriod;
    storage.set<Pick<Schema, "counterPeriod">>({ counterPeriod });
  });

  const init = <T extends Partial<Schema>>(items: T) => {
    if (items.blocked !== undefined) {
      elements.blockedList.value = items.blocked.join("\r\n"); // display every blocked on a new line
    }

    if (items.enabled !== undefined) {
      elements.enabled.value = booleanToString(items.enabled);
    }

    if (items.resolution !== undefined) {
      elements.resolution.value = items.resolution;
      RESOLUTIONS.forEach((oneResolution) => {
        document.body.classList.remove(`resolution-${oneResolution}`);
      });
      document.body.classList.add(`resolution-${items.resolution}`);
    }

    if (items.counterShow !== undefined) {
      elements.counterShow.value = booleanToString(items.counterShow);
      document.body.classList.toggle("counter-show", items.counterShow);
    }

    if (items.counterPeriod !== undefined) {
      elements.counterPeriod.value = items.counterPeriod;
    }
  };

  return { elements, init };
})();

window.addEventListener("DOMContentLoaded", () => {
  const keys: (keyof Schema)[] = ["blocked", "enabled", "resolution", "counterShow", "counterPeriod"];

  storage.get(keys, (local) => {
    UI.init(local);
    document.body.classList.add("ready");
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local") {
      keys.forEach((key) => {
        if (changes[key]) {
          UI.init({ [key]: changes[key].newValue });
        }
      });
    }
  });
});

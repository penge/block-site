import storage, {
  Schema, Resolution, CounterPeriod, RESOLUTIONS, BLOCKED_EXAMPLE,
} from "./storage";

const UI = (() => {
  const elements = {
    enabled: document.getElementById("enabled") as HTMLSelectElement,
    contextMenu: document.getElementById("context-menu") as HTMLSelectElement,
    blockedList: document.getElementById("blocked-list") as HTMLTextAreaElement,
    resolution: document.getElementById("resolution") as HTMLSelectElement,
    counterShow: document.getElementById("counter-show") as HTMLSelectElement,
    counterPeriod: document.getElementById("counter-period") as HTMLSelectElement,
  };

  elements.blockedList.placeholder = BLOCKED_EXAMPLE.join("\n");

  const booleanToString = (b: boolean) => b ? "YES" : "NO";
  const stringToBoolean = (s: string) => s === "YES";

  const getEventTargetValue = (event: Event) => (event.target as HTMLTextAreaElement | HTMLSelectElement).value;
  const stringToBlocked = (string: string) => string.split("\n").map((s) => s.trim()).filter(Boolean);

  elements.enabled.addEventListener("change", (event) => {
    const enabled = stringToBoolean(getEventTargetValue(event));
    storage.set({ enabled });
  });

  elements.contextMenu.addEventListener("change", (event) => {
    const contextMenu = stringToBoolean(getEventTargetValue(event));
    storage.set({ contextMenu });
  });

  elements.blockedList.addEventListener("input", (event) => {
    const blocked = stringToBlocked(getEventTargetValue(event));
    storage.set({ blocked });
  });

  elements.resolution.addEventListener("change", (event) => {
    const resolution = getEventTargetValue(event) as Resolution;
    storage.set({ resolution });
  });

  elements.counterShow.addEventListener("change", (event) => {
    const counterShow = stringToBoolean(getEventTargetValue(event));
    storage.set({ counterShow });
  });

  elements.counterPeriod.addEventListener("change", (event) => {
    const counterPeriod = getEventTargetValue(event) as CounterPeriod;
    storage.set({ counterPeriod });
  });

  const init = <T extends Partial<Schema>>(items: T) => {
    if (items.enabled !== undefined) {
      elements.enabled.value = booleanToString(items.enabled);
    }

    if (items.contextMenu !== undefined) {
      elements.contextMenu.value = booleanToString(items.contextMenu);
    }

    if (items.blocked !== undefined) {
      const valueAsBlocked = stringToBlocked(elements.blockedList.value);
      if (JSON.stringify(valueAsBlocked) !== JSON.stringify(items.blocked)) {
        elements.blockedList.value = items.blocked.join("\r\n");
      }
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
  const keys: (keyof Schema)[] = [
    "enabled",
    "contextMenu",
    "blocked",
    "resolution",
    "counterShow",
    "counterPeriod",
  ];

  storage.get(keys).then((local) => {
    UI.init(local);
    document.body.classList.add("ready");
  });

  chrome.storage.local.onChanged.addListener((changes) => {
    keys.forEach((key) => {
      if (changes[key]) {
        UI.init({ [key]: changes[key].newValue });
      }
    });
  });
});

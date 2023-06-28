import storage from "../storage";
import blockSite from "./block-site";
import normalizeUrl from "./normalize-url";

const createContextMenu = () => {
  const parentId = chrome.contextMenus.create({
    id: "block_site",
    title: "Block Site",
    documentUrlPatterns: ["https://*/*", "http://*/*"],
  });

  const blockThisSiteId = "block_this_site";
  chrome.contextMenus.create({
    parentId,
    id: blockThisSiteId,
    title: "Block this site",
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const tabId = tab?.id;
    if (!tabId || info.menuItemId !== blockThisSiteId) {
      return;
    }

    storage.get(["blocked"]).then(({ blocked }) => {
      const url = info.pageUrl;
      const normalizedUrl = normalizeUrl(url);
      const updatedBlocked = [...blocked, normalizedUrl];

      storage.set({ blocked: updatedBlocked });
      blockSite({ blocked: updatedBlocked, tabId, url });
    });
  });
};

export default () => {
  storage.get(["enabled"]).then(({ enabled }) => {
    chrome.contextMenus.removeAll(() => {
      if (enabled) {
        createContextMenu();
      }
    });

    chrome.storage.local.onChanged.addListener((changes) => {
      if (changes["enabled"]) {
        chrome.contextMenus.removeAll(() => {
          if (changes["enabled"].newValue as boolean) {
            createContextMenu();
          }
        });
      }
    });
  });
};

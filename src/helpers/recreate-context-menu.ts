import storage from "../storage";
import blockSite from "./block-site";
import removeProtocol from "./remove-protocol";

const createContextMenu = () => {
  const parentId = chrome.contextMenus.create({
    id: "block_site",
    title: "Block Site",
    documentUrlPatterns: ["https://*/*", "http://*/*"],
  });

  const blockOneId = "block_one";
  chrome.contextMenus.create({
    parentId,
    id: blockOneId,
    title: "Block this page only",
  });

  const blockAllId = "block_all";
  chrome.contextMenus.create({
    parentId,
    id: blockAllId,
    title: "Block entire website",
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const tabId = tab?.id;
    if (!tabId || ![blockOneId, blockAllId].includes(String(info.menuItemId))) {
      return;
    }

    const url = info.pageUrl;
    const blockedUrl = info.menuItemId === blockOneId
      ? removeProtocol(url)
      : new URL(url).host;

    storage.get(["blocked"]).then(({ blocked }) => {
      const updatedBlocked = [...blocked, blockedUrl];
      storage.set({ blocked: updatedBlocked });
      blockSite({ blocked: updatedBlocked, tabId, url });
    });
  });
};

export default (meetsCreateCondition: boolean) => {
  chrome.contextMenus.removeAll(() => {
    if (meetsCreateCondition) {
      createContextMenu();
    }
  });
};

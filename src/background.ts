import initStorage from "./storage/init";
import blockSite from "./helpers/block-site";
import createContextMenu from "./helpers/create-context-menu";

initStorage(createContextMenu);

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const { tabId, url, timeStamp, frameId } = details;
  if (!url || !url.startsWith("http") || frameId !== 0) {
    return;
  }

  blockSite({ tabId, url, timeStamp });
});

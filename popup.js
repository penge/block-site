const optionsButton = document.getElementById("options");
const enableButton = document.getElementById("enable");
const disableButton = document.getElementById("disable");

optionsButton.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

enableButton.addEventListener("click", () => {
  chrome.storage.local.set({ enabled: true });
  console.log("hi");

  enableButton.className = "pure-button-primary";
  disableButton.className = "pure-button";
});

disableButton.addEventListener("click", () => {
  chrome.storage.local.set({ enabled: false });

  disableButton.className = "pure-button-primary";
  enableButton.className = "pure-button";
});
8
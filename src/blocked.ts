const url = (new URLSearchParams(window.location.search)).get("url");
const urlElem = document.getElementById("url") as HTMLSpanElement;
urlElem.textContent = url;

const getParam = (name: string) => (new URLSearchParams(window.location.search)).get(name);

const setSpan = (id: string, content: string) => {
  const span = document.getElementById(id) as HTMLSpanElement;
  span.textContent = content;
};

window.addEventListener("DOMContentLoaded", () => {
  const url = getParam("url");
  if (url) {
    setSpan("url", url);
  }

  const count = getParam("count");
  if (count) {
    setSpan("count", ` ${count}x`);
  }
});

import storage, { VALIDATORS, CounterPeriod, Schema} from "./storage";
import getBlockedMessage from "./helpers/get-blocked-message";

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const url = params.get("url");
  if (!url) {
    return;
  }

  const rule = params.get("rule");
  if (!rule) {
    return;
  }

  const count = parseInt(params.get("count") || "");
  const period = params.get("period");
  const countParams = (!isNaN(count) && VALIDATORS.counterPeriod(period))
    ? { count, period: period as CounterPeriod }
    : undefined;

  const message = getBlockedMessage({
    url,
    rule,
    countParams,
  });



  (document.getElementById("message") as HTMLParagraphElement).innerHTML = message;
  document.body.classList.add("ready");

  const keys: (keyof Schema)[] = [
    "redirect",
  ];
  storage.get(keys).then((local) => {
    if (typeof local.redirect == "string" && local.redirect != "") {
      setTimeout( () => {
        window.location.href = local.redirect
      }, 2000 );
    }
  });
});

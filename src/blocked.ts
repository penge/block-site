import { VALIDATORS, CounterPeriod } from "./storage";
import getBlockedMessage from "./helpers/get-blocked-message";

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const rule = params.get("rule");
  if (!rule) {
    return;
  }

  const count = params.get("count");
  const period = params.get("period");

  const message = getBlockedMessage({
    rule,
    count: count || undefined,
    period: VALIDATORS.counterPeriod(period) ? period as CounterPeriod : undefined,
  });

  (document.getElementById("message") as HTMLParagraphElement).innerHTML = message;
});

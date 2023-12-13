import normalizeUrl, { appendTrailingSlashIfMissing } from "./normalize-url";
import makeRules, { Rule } from "./make-rules";

export default (url: string, blocked: string[]): Rule | undefined => {
  const normalizedUrl = normalizeUrl(url);
  const rules = makeRules(blocked);

  const foundRule = rules.find((rule) =>
    normalizedUrl.match(new RegExp(
      "^"
      /**
       * To make it convenient for the user to block the root path (homepage),
       * he can type either of:
       * - example.com
       * - example.com/
       * and they both will work.
       *
       * To make this work, we append trailing slash if missing, and
       * use that for the pattern matching.
       *
       * The original rule in "rules" remains unchanged,
       * because it is the rule we would like to show to the user if blocked.
       */
      + appendTrailingSlashIfMissing(rule.path)
        .replace(/\?/g, ".")  // user can type "?" to match any one character
        .replace(/\*/g, ".*") // user can type "*" to match any zero or more characters
      + "$",
    )));

  return foundRule;
};

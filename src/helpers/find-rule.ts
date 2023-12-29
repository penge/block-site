import normalizeUrl from "./normalize-url";
import makeRules, { Rule } from "./make-rules";

export default (url: string, blocked: string[]): Rule | undefined => {
  const normalizedUrl = normalizeUrl(url);
  const rules = makeRules(blocked);

  const foundRule = rules.find((rule) =>
    normalizedUrl.match(new RegExp(
      "^"
      + rule.path
        .replace(/\?/g, ".")  // user can type "?" to match any one character
        .replace(/\*/g, ".*") // user can type "*" to match any zero or more characters
      + "$",
    )));

  return foundRule;
};

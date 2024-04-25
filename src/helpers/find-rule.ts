import removeProtocol from "./remove-protocol";
import makeRules, { Rule } from "./make-rules";

const expandPath = (path: string) => {
  const expanded = [path];
  if (!["*.", "www."].find((prefix) => path.startsWith(prefix))) {
    expanded.push(`www.${path}`);
  }

  [...expanded].forEach((path) => {
    if (!path.includes("/")) {
      expanded.push(`${path}/*`);
    }
  });

  return expanded;
};

export default (url: string, blocked: string[]): Rule | undefined => {
  const normalizedUrl = removeProtocol(url);
  const rules = makeRules(blocked);

  const foundRule = rules.find(({ path }) => {
    const patterns = expandPath(path)
      .map((path) => path.replace(/[.+]/g, "\\$&")) // escape regex characters
      .map((path) => (
        "^"
        + path
          .replace(/\?/g, ".")   // user can type "?" to match any one character
          .replace(/\*/g, ".*")  // user can type "*" to match any zero or more characters
        + "$"
      ));

    const found = patterns.some((pattern) => {
      const matches = normalizedUrl.match(new RegExp(pattern));
      return matches;
    });

    return found;
  });

  return foundRule;
};

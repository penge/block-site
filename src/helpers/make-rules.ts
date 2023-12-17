import normalizeUrl from "./normalize-url";

type RuleType = "allow" | "block"

export interface Rule {
  type: RuleType
  path: string
}

export default (blocked: string[]): Rule[] => {
  const allowList = blocked
    .filter((item) => item.startsWith("!"))
    .map((item) => normalizeUrl(item.substring(1)));

  const blockList = blocked
    .filter((item) => !item.startsWith("!"))
    .map(normalizeUrl);

  return [
    ...allowList.map((path) => ({ type: "allow", path } as Rule)),
    ...blockList.map((path) => ({ type: "block", path } as Rule)),
  ];
};

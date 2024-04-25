import removeProtocol from "./remove-protocol";

type RuleType = "allow" | "block"

export interface Rule {
  type: RuleType
  path: string
}

export default (blocked: string[]): Rule[] => {
  const allowList = blocked
    .filter((item) => item.startsWith("!"))
    .map((item) => removeProtocol(item.substring(1)));

  const blockList = blocked
    .filter((item) => !item.startsWith("!"))
    .map(removeProtocol);

  return [
    ...allowList.map((path) => ({ type: "allow", path } as Rule)),
    ...blockList.map((path) => ({ type: "block", path } as Rule)),
  ];
};

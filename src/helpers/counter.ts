import { Schema } from "./storage";
import makeRules from "./make-rules";

export const flushObsoleteEntries = ({ blocked, counter }: Pick<Schema, "blocked" | "counter">) => {
  const allBlockRulePaths = makeRules(blocked).filter((rule) => rule.type === "block").map((rule) => rule.path);
  const obsoleteCounterKeys = Object.keys(counter).filter((key) => !allBlockRulePaths.includes(key));
  obsoleteCounterKeys.forEach((obsoleteKey) => {
    delete counter[obsoleteKey];
  });
};

export const add = (rulePath: string, timeStamp: number, { counter }: Pick<Schema, "counter">): number => {
  if (!(rulePath in counter)) {
    counter[rulePath] = [];
  }

  return counter[rulePath].push(timeStamp);
};

import { Schema, CounterPeriod } from "../storage";
import makeRules from "./make-rules";
import dayjs from "./dayjs";

export const flushObsoleteEntries = ({ blocked, counter }: Pick<Schema, "blocked" | "counter">) => {
  const allBlockRulePaths = makeRules(blocked).filter((rule) => rule.type === "block").map((rule) => rule.path);
  const obsoleteCounterKeys = Object.keys(counter).filter((key) => !allBlockRulePaths.includes(key));
  obsoleteCounterKeys.forEach((obsoleteKey) => {
    delete counter[obsoleteKey];
  });
};

export const counterPeriodToTimeStamp = (counterPeriod: CounterPeriod, now: number): number => {
  switch (counterPeriod) {
  case "ALL_TIME":
    return 0;
  case "THIS_MONTH":
    return +dayjs(now).startOf("month");
  case "THIS_WEEK":
    return +dayjs(now).startOf("week");
  case "TODAY":
    return +dayjs(now).startOf("day");
  }
};

export const add = (rulePath: string, timeStamp: number, { counter, countFromTimeStamp }: Pick<Schema, "counter"> & { countFromTimeStamp: number }): number => {
  if (!(rulePath in counter)) {
    counter[rulePath] = [];
  }

  counter[rulePath].push(timeStamp);
  return (countFromTimeStamp === 0)
    ? counter[rulePath].length
    : counter[rulePath].filter((value) => value >= countFromTimeStamp).length;
};

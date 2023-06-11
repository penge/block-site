import { Schema } from "./schema";

export * from "./schema";

const set = <T extends Partial<Schema>>(items: T, callback?: () => void) => {
  chrome.storage.local.set(items, callback);
};

const get = <T extends keyof Schema>(keys: T[], callback: (items: Pick<Schema, T>) => void) => {
  chrome.storage.local.get(keys, (items) => callback(items as Pick<Schema, T>));
};

const getAll = (callback: (items: Schema) => void) =>
  get(["enabled", "blocked", "counter", "counterShow", "counterPeriod", "resolution"], callback);

export default {
  set,
  get,
  getAll,
};

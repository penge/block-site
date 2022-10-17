export interface Schema {
  enabled: boolean
  blocked: string[]
  counter: Record<string, number[]>
  resolution: string
}

const set = <T extends Partial<Schema>>(items: T) => {
  chrome.storage.local.set(items);
};

const get = <T extends keyof Schema>(keys: T[], callback: (items: Pick<Schema, T>) => void) => {
  chrome.storage.local.get(keys, (items) => callback(items as Pick<Schema, T>));
};

export default {
  set,
  get,
};

export const RESOLUTIONS = [
  "CLOSE_TAB",
  "SHOW_BLOCKED_INFO_PAGE",
] as const;

export const COUNTER_PERIODS = [
  "ALL_TIME",
  "THIS_MONTH",
  "THIS_WEEK",
  "TODAY",
] as const;

export type Resolution = typeof RESOLUTIONS[number];
export type CounterPeriod = typeof COUNTER_PERIODS[number];

export interface Schema {
  enabled: boolean
  blocked: string[]
  counter: Record<string, number[]>
  counterShow: boolean
  counterPeriod: CounterPeriod
  resolution: Resolution
}

export const DEFAULTS: Readonly<Schema> = {
  enabled: false,
  blocked: [],
  counter: {},
  counterShow: false,
  counterPeriod: "ALL_TIME",
  resolution: "CLOSE_TAB",
};

export const VALIDATORS: Readonly<Record<keyof Schema, (value: unknown) => boolean>> = {
  enabled: (value) => typeof value === "boolean",
  blocked: (value) => Array.isArray(value),
  counter: (value) => typeof value === "object",
  counterShow: (value) => typeof value === "boolean",
  counterPeriod: (value) => COUNTER_PERIODS.includes(value as CounterPeriod),
  resolution: (value) => RESOLUTIONS.includes(value as Resolution),
};

export const BLOCKED_EXAMPLE: string[] = [
  "facebook.com",
  "instagram.com",
  "youtube.com",
  "!music.youtube.com",
  "reddit.com",
  "!reddit.com/r/MachineLearning",
];

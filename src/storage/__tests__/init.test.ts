import { getRevisitedSchema } from "../init";
import { Schema, DEFAULTS } from "../schema";

test("getRevisitedSchema() returns defaults for any invalid attribute", () => {
  expect(getRevisitedSchema({})).toEqual(DEFAULTS);

  expect(getRevisitedSchema(DEFAULTS)).toEqual({});

  expect(getRevisitedSchema({
    enabled: DEFAULTS.enabled,
    blocked: DEFAULTS.blocked,
  })).toEqual({
    counter: DEFAULTS.counter,
    counterShow: DEFAULTS.counterShow,
    counterPeriod: DEFAULTS.counterPeriod,
    resolution: DEFAULTS.resolution,
  } as Partial<Schema>);

  expect(getRevisitedSchema({
    ...DEFAULTS,
    enabled: "YES", // invalid
  })).toEqual({
    enabled: DEFAULTS.enabled,
  } as Partial<Schema>);

  expect(getRevisitedSchema({
    ...DEFAULTS,
    enabled: "YES", // invalid
    blocked: "ALL", // invalid
    resolution: "BLOCK", // invalid
  })).toEqual({
    enabled: DEFAULTS.enabled,
    blocked: DEFAULTS.blocked,
    resolution: DEFAULTS.resolution,
  } as Partial<Schema>);
});

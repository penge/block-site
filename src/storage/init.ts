import storage, { Schema, DEFAULTS, VALIDATORS } from ".";

export const getRevisitedSchema = (local: Partial<Schema> | Record<string, unknown>) => {
  const revisitedSchema: Partial<Schema> = {};
  const update = <K extends keyof Schema>(key: K, value: Schema[K]) => revisitedSchema[key] = value;

  Object.keys(DEFAULTS).forEach((key) => {
    const schemaKey = key as keyof Schema;
    const isValid = VALIDATORS[schemaKey](local[schemaKey]);
    if (!isValid) {
      update(schemaKey, DEFAULTS[schemaKey]);
    }
  });

  return revisitedSchema;
};

export default (): Promise<void> => new Promise((resolve) => {
  storage.getAll().then((local) => {
    const revisitedSchema = getRevisitedSchema(local);
    if (Object.keys(revisitedSchema).length) {
      storage.set(revisitedSchema).then(resolve);
      return;
    }
    resolve();
  });
});

import { faker } from "@faker-js/faker";

const UNRESOLVED_PATH = Symbol("UNRESOLVED_PATH");

function resolveFakerPath(path: string) {
  const parts = path.split(".");

  let current: any = faker;
  let parent: any = null;

  for (const part of parts) {
    if (current == null || !(part in current)) {
      return UNRESOLVED_PATH;
    }

    parent = current;
    current = current[part];
  }

  if (typeof current === "function") {
    return current.call(parent);
  }

  return current;
}

function resolveSchemaValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => resolveSchemaValue(item));
  }

  if (value && typeof value === "object") {
    const resolvedObject: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      resolvedObject[key] = resolveSchemaValue(nestedValue);
    }

    return resolvedObject;
  }

  if (typeof value === "string") {
    const resolved = resolveFakerPath(value);

    if (resolved === UNRESOLVED_PATH) {
      return value;
    }

    return resolved;
  }

  return value;
}

function dataGenerator(dataSchema: Record<string, unknown>) {
  const mockData: Record<string, unknown> = {};

  for (const [key, schemaValue] of Object.entries(dataSchema)) {
    mockData[key] = resolveSchemaValue(schemaValue);
  }

  return mockData;
}

export default dataGenerator;

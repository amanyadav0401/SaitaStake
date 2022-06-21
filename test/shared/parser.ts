export function assert<T>(property: string, value: T | undefined): T {
  assertDefined(property, value);
  return value;
}

export function assertNotEmpty(property: string, value: string | undefined): string {
  assertDefined(property, value);
  if (!value) {
    throw new Error(`Empty property: ${property}`);
  }
  return value;
}

export function assertNotEmptyArray<T>(property: string, value: T[] | undefined): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`Empty property: ${property} is not array`);
  }
  if (value.length === 0) {
    throw new Error(`Empty property: ${property} is empty array`);
  }
  return value;
}

export function assertDefined<T>(property: string, obj: T): asserts obj is NonNullable<T> {
  if (obj === undefined || obj === null) {
    throw new Error(`Undefined property: ${property}`);
  }
}

export function parseString(property: string): string {
  const value = process.env[property];
  assertDefined(property, value);
  assertNotEmpty(property, value);
  return value;
}

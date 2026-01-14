export function parseJsonBody(
  body,
  { integerFields = [], dateFields = [], booleanFields = [] } = {}
) {
  const result = {};

  for (const key in body) {
    let value = body[key];

    if (
      value === "" ||
      value === "null" ||
      value === "undefined" ||
      value == null
    ) {
      result[key] = null;
      continue;
    }

    if (booleanFields.includes(key)) {
      result[key] = value === true || value === "true";
      continue;
    }

    if (integerFields.includes(key)) {
      const intVal = parseInt(value, 10);
      result[key] = isNaN(intVal) ? null : intVal;
      continue;
    }

    if (dateFields.includes(key)) {
      const date = new Date(value);
      result[key] = isNaN(date.getTime()) ? null : date;
      continue;
    }

    result[key] = typeof value === "string" ? value.trim() : value;
  }

  return result;
}

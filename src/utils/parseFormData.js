export function parseFormData(
  formData,
  { integerFields = [], dateFields = [], booleanFields = [] } = {}
) {
  const result = {};

  for (const [key, value] of formData.entries()) {
    // Jika value adalah file
    if (value instanceof File) {
      result[key] = value;
      continue;
    }

    const trimmed = value.trim();

    // Ubah string kosong, "null", atau undefined menjadi null
    if (
      trimmed === "" ||
      trimmed.toLowerCase() === "null" ||
      trimmed === "undefined"
    ) {
      result[key] = null;
      continue;
    }

    // Konversi field boolean
    if (booleanFields.includes(key)) {
      if (trimmed === "true") {
        result[key] = true;
      } else if (trimmed === "false") {
        result[key] = false;
      } else {
        result[key] = null;
      }
      continue;
    }

    // Konversi field tanggal
    if (dateFields.includes(key)) {
      const dateValue = new Date(trimmed);
      result[key] = isNaN(dateValue.getTime()) ? null : dateValue;
      continue;
    }

    // Konversi field integer
    if (integerFields.includes(key)) {
      result[key] = /^\d+$/.test(trimmed) ? parseInt(trimmed, 10) : null;
      continue;
    }

    // Default: string
    result[key] = trimmed;
  }

  return result;
}

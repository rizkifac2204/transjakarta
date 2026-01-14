export const isValidFile = (val) => val && typeof val !== "string";

export const isValidFileArray = (arr) =>
  Array.isArray(arr) &&
  arr.length > 0 &&
  arr.some((item) => typeof item !== "string" && item.size > 0);

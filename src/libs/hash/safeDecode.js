import { decodeId } from "./hashId";
import { notFound } from "next/navigation";

/**
 * Decode hash ke ID numerik, otomatis notFound() jika tidak valid
 * @param {string} encodedId
 * @returns {number}
 */
export function decodeOrNotFound(encodedId) {
  const id = decodeId(encodedId);
  if (!id || isNaN(id)) notFound();
  return Number(id);
}

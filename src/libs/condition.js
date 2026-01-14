import { verifyAuth } from "./auth";

// saat ini digunakan untuk query langsung ke tabel permohonan dan keberatan dengan menyertakan admin_id

export async function getConditionByAuth() {
  const auth = await verifyAuth();

  return auth.level > 2
    ? { admin_id: auth.id, deleted_at: null }
    : { deleted_at: null };
}

export async function getDetailConditionByAuth(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  const auth = await verifyAuth();

  return auth.level > 2
    ? { id: parsedId, admin_id: auth.id, deleted_at: null }
    : { id: parsedId, deleted_at: null };
}

// trash

export async function getTrashConditionByAuth() {
  const auth = await verifyAuth();

  return auth.level > 2
    ? { admin_id: auth.id, deleted_at: { not: null } }
    : { deleted_at: { not: null } };
}

export async function getTrashDetailConditionByAuth(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  const auth = await verifyAuth();

  return auth.level > 2
    ? { id: parsedId, admin_id: auth.id, deleted_at: { not: null } }
    : { id: parsedId, deleted_at: { not: null } };
}

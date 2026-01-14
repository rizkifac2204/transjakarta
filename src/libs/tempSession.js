const tempSessions = new Map();

export function createTempSession(userData, expireSec = 300) {
  const token = cryptoRandomString(32);
  const expireAt = Date.now() + expireSec * 1000;
  tempSessions.set(token, { userData, expireAt });
  return token;
}

export function getTempSession(token) {
  const session = tempSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expireAt) {
    tempSessions.delete(token);
    return null;
  }
  return session.userData;
}

export function deleteTempSession(token) {
  tempSessions.delete(token);
}

function cryptoRandomString(length) {
  return [...Array(length)]
    .map(() => Math.floor(Math.random() * 36).toString(36))
    .join("");
}

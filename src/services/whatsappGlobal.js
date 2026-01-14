if (!globalThis._whatsappSock) {
  globalThis._whatsappSock = {
    sock: null,
  };
}

export function getSession() {
  return globalThis._whatsappSock.sock;
}

export function isSessionExists() {
  return !!globalThis._whatsappSock.sock;
}

export function setSession(sock) {
  globalThis._whatsappSock.sock = sock;
}

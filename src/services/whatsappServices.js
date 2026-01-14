/* eslint-disable react-hooks/rules-of-hooks */
import getLogs from "@/libs/getLogs";
import { rmSync } from "fs";
import pino from "pino";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  delay,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
const msgRetryCounterMap = {};
const sessionName = "mainId";
const sessions = new Map();
const sessionDir = ".baileys";
const logger = pino({ level: "warn" });
import { setSession, isSessionExists, getSession } from "./whatsappGlobal";
import parsePertanyaanAi from "@/utils/parsePertanyaanAi";
import askOpenAi from "@/libs/askOpenAI";

const CreateSession = async (io, sessionId) => {
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    msgRetryCounterMap,
    generateHighQualityLinkPreview: true,
  });

  sessions.set(sessionId, { ...sock, store: "store" });

  // === CONNECTION.UPDATE ===
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr, isNewLogin, isOnline } = update;
    const statusCode = lastDisconnect?.error?.output?.statusCode;
    const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

    if (connection === "close") {
      if (shouldReconnect) {
        // ignore sementara 440
        if (statusCode && statusCode !== 440) {
          console.log("reconnect");
          CreateSession(io, sessionId);
        }
      } else {
        // delete store
        deleteSession();
        io.emit("statusWA", {
          status: "Connection closed",
          message: `Kamu sudah tidak terhubung, refresh halaman untuk menerima QRCode`,
        });
      }
    }

    if (update.qr) {
      io.emit("statusWA", {
        status: "Scan",
        message: `QR code Diterima, Silakan Lakukan Scan`,
        qr: update.qr,
      });
    }

    if (update.isNewLogin) {
      io.emit("statusWA", {
        status: "Ready",
        message: `Selamat Datang, halaman akan di Refresh untuk menyelesaikan Proses`,
        info: sock.authState.creds,
        isNewLogin: true,
      });
    }

    if (update.isOnline) {
      io.emit("statusWA", {
        status: "Ready",
        message: `Whatsapp sudah bisa digunakan`,
        info: sock.authState.creds,
      });
    }
  });

  // === CREDS.UPDATE ===
  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const noWa = msg.key.remoteJid;
    const messageContent =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      "";

    const messageToAi = parsePertanyaanAi(messageContent);
    if (messageToAi) {
      const responseAi = await askOpenAi(messageToAi);
      if (responseAi.success) {
        await sock.sendMessage(
          noWa,
          {
            text: responseAi.message || "Tidak ada respons dari AI",
          },
          { quoted: msg }
        );
      }
    }

    // Tandai sebagai dibaca
    // await sock.readMessages([msg.key]);
  });

  setSession(sock);
  return sock;
};

const deleteSession = async () => {
  const sock = getSession();
  if (sock) {
    try {
      await sock.logout();
      sock.end();
    } catch (e) {
      console.error("Error saat logout:", e);
    }
  }

  rmSync(sessionDir, { force: true, recursive: true });
  sessions.delete(sessionName);
  setSession(null);
};

// const isSessionExists = () => {
//   return sessions.has(sessionName);
// };

// const getSession = () => {
//   return sessions.get(sessionName) ?? null;
// };

const formatPhone = (phone) => {
  let formatted = phone.replace(/\D/g, "");

  // Menghilangkan angka 0 di depan diganti dengan 62
  if (formatted.startsWith("0")) {
    formatted = "62" + formatted.substr(1);
  }
  // handle jika dimulai langsung dari angka 8 bukan nol (input number)
  if (formatted.startsWith("8")) {
    formatted = "62" + formatted;
  }

  if (!formatted.endsWith("@s.whatsapp.net")) {
    formatted = formatted + "@s.whatsapp.net";
  }

  return formatted;
};

const isExists = async (session, jid, isGroup = false) => {
  try {
    let result;

    if (isGroup) {
      result = await session.groupMetadata(jid);

      return Boolean(result.id);
    }

    [result] = await session.onWhatsApp(jid);

    return result.exists;
  } catch {
    return false;
  }
};

const sendMessage = async (session, receiver, message, delayMs = 1000) => {
  try {
    await delay(parseInt(delayMs));

    return await session.sendMessage(receiver, { text: message });
  } catch (e) {
    getLogs("whatsapp").error(e);
    return Promise.reject(null); // eslint-disable-line prefer-promise-reject-errors
  }
};

const initWhatsapp = (io) => {
  CreateSession(io, sessionName);
};

export {
  initWhatsapp,
  isSessionExists,
  getSession,
  formatPhone,
  deleteSession,
  isExists,
  sendMessage,
};

function requireWhatsapp(require, messageError) {
  if (require) throw new Error(messageError);
  return false;
}

export async function prepareAndSendMessage(
  require = false,
  confirmKirim = true,
  receiver,
  msg,
  delayMs = 1000
) {
  try {
    if (!receiver) return requireWhatsapp(require, "Nomor Tidak Terdeteksi");
    if (!msg) return requireWhatsapp(require, "Pesan Tidak Boleh Kosong");
    if (!confirmKirim) return true;

    const cekIsSessionExists = isSessionExists();
    if (!cekIsSessionExists)
      return requireWhatsapp(require, "Whatsapp Tidak Dapat Digunakan");

    const cekGetSession = getSession();
    const formatedPhone = formatPhone(receiver);
    const [isExistOnWhatsapp] = await cekGetSession.onWhatsApp(formatedPhone);

    if (!isExistOnWhatsapp || !isExistOnWhatsapp.exists)
      return requireWhatsapp(require, "Nomor Tidak Terdaftar Whatsapp");

    await delay(parseInt(delayMs));
    await cekGetSession.sendMessage(formatedPhone, { text: msg });

    return true;
  } catch (error) {
    getLogs("whatsapp").error(error);
    return false;
  }
}

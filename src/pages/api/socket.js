import { Server } from "socket.io";
import {
  initWhatsapp,
  isSessionExists,
  getSession,
  formatPhone,
  isExists,
  sendMessage,
  deleteSession,
} from "@/services/whatsappServices";
import getLogs from "@/libs/getLogs";

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      return handleGET(req, res);
    case "POST":
      return handlePOST(req, res);
    case "DELETE":
      return handleDELETE(req, res);
    default:
      return res
        .status(405)
        .json({ message: "Metode tidak diizinkan", type: "error" });
  }
}

async function handleGET(req, res) {
  try {
    const server = res.socket.server;

    if (!server.io) {
      const io = new Server(server);
      server.io = io;

      io.on("connection", (socket) => {
        socket.emit("statusWA", {
          status: "Check",
          message: "Memeriksa Status",
        });

        initWhatsapp(socket);
      });

      console.log("Socket.io initialized");
    } else {
      console.log("Socket.io already initialized");
    }

    return res.json({ message: "Socket is ready", type: "info" });
  } catch (error) {
    getLogs("socket").error(error);
    return res.status(400).json({
      message: "Terjadi Kesalahan Sistem",
      type: "error",
    });
  }
}

async function handlePOST(req, res) {
  try {
    let { number, message } = req.body;

    if (!number || !message) {
      return res.status(400).json({
        type: "error",
        message: "Nomor dan pesan wajib diisi",
      });
    }

    if (!isSessionExists()) {
      return res.status(400).json({
        type: "error",
        message: "Whatsapp tidak terhubung",
      });
    }
    const session = getSession();
    const formatted = formatPhone(number);
    const exists = await isExists(session, formatted);

    if (!exists) {
      return res.status(400).json({
        type: "error",
        message: "Nomor tidak terdaftar di WhatsApp",
      });
    }

    const success = await sendMessage(session, formatted, message, 0);

    if (success) {
      return res.json({
        type: "success",
        message: "Pesan WhatsApp berhasil dikirim",
      });
    } else {
      return res.status(500).json({
        type: "error",
        message: "Gagal mengirim pesan WhatsApp",
      });
    }
  } catch (error) {
    getLogs("socket").error(error);
    return res
      .status(400)
      .json({ message: "Terjadi Kesalahan Sistem", type: "error" });
  }
}

// Handler DELETE
function handleDELETE(req, res) {
  try {
    deleteSession();
    return res.json({
      type: "success",
      message:
        "Berhasil Logout, Silakan Refresh Halaman Untuk Menerima QRCode Kembali",
    });
  } catch (error) {
    getLogs("socket").error(error);
    return res
      .status(400)
      .json({ message: "Terjadi Kesalahan Sistem", type: "error" });
  }
}

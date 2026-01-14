import { NextResponse } from "next/server";
import { Server } from "socket.io";
import { initWhatsapp } from "@/services/whatsappServices";
import getLogs from "@/libs/getLogs";

const onConnection = (socket) => {
  socket.emit("statusWA", {
    status: "Check",
    message: `Memeriksa Status`,
  });
  initWhatsapp(socket);
};

export async function GET() {
  try {
    // Pastikan kita hanya menginisialisasi sekali
    if (!globalThis.io) {
      console.log("initializing socket.io...");
      const httpServer = globalThis._server; // <- kamu harus simpan http server di globalThis._server saat menjalankan server

      if (!httpServer?.res?.socket?.server) {
        console.warn("Server not available on this environment.");
        return NextResponse.json(
          { message: "Server belum siap", type: "warning" },
          { status: 500 }
        );
      }

      const io = new Server(httpServer.res.socket.server, {
        path: "/api/socket.io",
      });

      io.on("connection", onConnection);

      globalThis.io = io;
    } else {
      console.log("Socket.io already initialized.");
    }

    return NextResponse.json({ message: "Socket is ready", type: "info" });
  } catch (error) {
    getLogs("whatsapp").error(error);
    return NextResponse.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import axios from "axios";
import { toast } from "react-toastify";
import { useWhatsappContext } from "@/providers/whatsapp-provider";
import Textinput from "@/components/ui/TextInput";
import Textarea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";

function ContentWhatsappPage() {
  const { whatsapp } = useWhatsappContext();
  const [qrImage, setQrImage] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isProses, setIsProses] = useState(false);

  // Generate QR code image from string
  useEffect(() => {
    if (whatsapp.qr) {
      QRCode.toDataURL(whatsapp.qr)
        .then(setQrImage)
        .catch(() => setQrImage(""));
    }
  }, [whatsapp.qr]);

  // Kirim pesan WA
  const kirimWhatsapp = async () => {
    if (!number.trim() || !message.trim()) {
      toast.warning("Nomor dan pesan wajib diisi.");
      return;
    }

    setIsProses(true);

    try {
      const res = await axios.post("/api/socket", { number, message });
      toast.success(res.data.message || "Pesan terkirim.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal mengirim pesan.");
    } finally {
      setIsProses(false);
    }
  };

  // Logout WhatsApp
  const handleLogout = async () => {
    const confirmed = confirm(
      "Apakah Anda yakin ingin logout dari WhatsApp?\n\nJika dilanjutkan, tidak ada notifikasi ke admin atau pemohon."
    );
    if (!confirmed) return;

    setIsProses(true);
    try {
      const res = await axios.delete("/api/socket");
      toast.success(res?.data?.message || "Berhasil logout.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal logout.");
    } finally {
      setIsProses(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 p-4">
        {/* QR Code jika belum login */}
        {whatsapp.status !== "Ready" && qrImage && (
          <>
            <h1 className="text-xl font-semibold mb-2">Scan QR WhatsApp</h1>
            <Image
              src={qrImage}
              alt="QR Code"
              width={256}
              height={256}
              className="w-64 h-64 mb-2"
            />
            <p className="text-sm text-gray-600">
              Silakan scan QR untuk menggunakan WhatsApp dalam aplikasi ini.
            </p>
          </>
        )}

        {/* Form kirim WA dan tombol logout jika status Ready */}
        {whatsapp.info && whatsapp.status === "Ready" && (
          <>
            <ul className="my-4">
              <li>
                <strong>Nama:</strong> {whatsapp.info?.me?.name}
              </li>
              <li>
                <strong>Nomor:</strong> {whatsapp.info?.me?.id.split(":")[0]}
              </li>
              <li>
                <strong>Platform:</strong> {whatsapp.info?.platform}
              </li>
            </ul>

            <Button
              className="btn-outline-dark btn-sm px-8 mb-4"
              text="Logout Whatsapp"
              icon="solar:logout-3-broken"
              disabled={isProses}
              onClick={handleLogout}
            />

            <div className="my-4">
              <p className="text-center mb-2 font-semibold">
                Formulir Kirim Whatsapp
              </p>

              <Textinput
                label="Nomor Whatsapp"
                name="number"
                id="number"
                placeholder="08xxxxxxx"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />

              <Textarea
                label="Pesan Whatsapp"
                name="message"
                id="message"
                placeholder="Isi pesan WA"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <Button
                className="mt-2 btn-outline-dark px-8 py-1 block-btn"
                text="Kirim Pesan"
                icon="hugeicons:sent"
                disabled={isProses}
                onClick={kirimWhatsapp}
              />
            </div>
          </>
        )}
      </div>

      {/* Panel debugging */}
      <div className="md:col-span-1 p-4">
        <h3 className="text-base font-semibold mb-2">Debugging Whatsapp</h3>
        <pre className="text-sm p-2 rounded w-full max-h-[400px] overflow-y-auto whitespace-pre-wrap bg-slate-100 dark:bg-slate-600">
          {JSON.stringify(whatsapp, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default ContentWhatsappPage;

import getLogs from "@/libs/getLogs";
import nodemailer from "nodemailer";

// Transporter SMTP lokal (Postfix)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "mail.bp2mi.go.id",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASSWORD || "",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendEmail({ to, subject, html }) {
  try {
    const result = await transporter.sendMail({
      from: `"PPID" <noreply_ppid@bp2mi.go.id>`,
      to,
      subject,
      html,
    });

    if (!result.messageId) {
      console.error("Gagal kirim email: messageId kosong");
      return false;
    }

    return true;
  } catch (error) {
    getLogs("emailServices").error(error);
    return false;
  }
}

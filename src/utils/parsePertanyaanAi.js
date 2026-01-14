export default function parsePertanyaanAi(message) {
  const prefix = "kp2mi";

  // Ubah ke huruf kecil dan trim spasi
  const normalized = message.trim().toLowerCase();

  if (normalized.startsWith(prefix)) {
    const match = message.match(/^kp2mi[, ]+(.*)/i);
    if (match && match[1]) {
      return match[1].trim(); // ini kalimat bersih yang bisa dilempar ke AI
    }
  }

  return null; // tidak cocok format
}

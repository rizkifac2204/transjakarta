function validateEmail(email) {
  if (!email) return false;

  // Regex sederhana untuk validasi email format dasar
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export default validateEmail;

export function maskEmail(email) {
  const [local, domain] = email.split("@");

  if (local.length <= 3) {
    // Jika terlalu pendek, tampilkan satu karakter saja
    return local[0] + "*".repeat(local.length - 1) + "@" + domain;
  }

  const start = local.slice(0, 2); // 2 huruf awal
  const end = local.slice(-1); // 1 huruf akhir
  const masked = "*".repeat(local.length - 3); // sisa karakter diganti *

  return `${start}${masked}${end}@${domain}`;
}

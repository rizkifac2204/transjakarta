export function validateStrongPassword(value) {
  const minLength = /.{6,}/; // minimal 6 karakter
  const hasUpper = /[A-Z]/;
  const hasLower = /[a-z]/;
  const hasNumber = /[0-9]/;
  const hasSymbol = /[^A-Za-z0-9]/;

  if (!minLength.test(value)) return "Password minimal 6 karakter";
  if (!hasUpper.test(value)) return "Harus mengandung huruf besar";
  if (!hasLower.test(value)) return "Harus mengandung huruf kecil";
  if (!hasNumber.test(value)) return "Harus mengandung angka";
  // jika ingin opsional karakter simbol, baris ini bisa dihapus:
  if (!hasSymbol.test(value)) return "Harus mengandung karakter spesial";

  return true;
}

export function validateStrongPasswordPemohon(value) {
  const minLength = /.{6,}/; // minimal 6 karakter
  const hasUpper = /[A-Z]/;
  const hasLower = /[a-z]/;
  const hasNumber = /[0-9]/;

  if (!minLength.test(value)) return "Password minimal 6 karakter";
  if (!hasUpper.test(value)) return "Harus mengandung huruf besar";
  if (!hasLower.test(value)) return "Harus mengandung huruf kecil";
  if (!hasNumber.test(value)) return "Harus mengandung angka";

  return true;
}

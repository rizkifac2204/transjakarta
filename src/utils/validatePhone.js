function validatePhone(phone) {
  if (!phone) return false;

  // Regex sederhana: hanya angka, bisa diawali 0 atau +62, panjang 9–15 digit
  const regex = /^(?:\+62|0)[0-9]{9,13}$/;
  return regex.test(phone);
}

export default validatePhone;

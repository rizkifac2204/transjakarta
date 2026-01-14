export default async function getRecaptchaToken(action = "submit_form") {
  if (!window.grecaptcha) {
    throw new Error("reCAPTCHA belum siap");
  }

  try {
    const token = await window.grecaptcha.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      { action }
    );
    return token;
  } catch (err) {
    throw new Error("Gagal mendapatkan token reCAPTCHA");
  }
}

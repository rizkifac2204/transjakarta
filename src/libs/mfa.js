import speakeasy from "speakeasy";
import { updateProfile } from "@/libs/profile";

export async function getOrCreateMfaSecret(
  user,
  issuer = "Survey Transjakarta"
) {
  let secret;

  if (user.mfa_secret) {
    // Secret sudah ada, rebuild otpauth_url
    secret = {
      base32: user.mfa_secret,
      otpauth_url: `otpauth://totp/${encodeURIComponent(
        issuer
      )}:${encodeURIComponent(user?.nama || "User")}?secret=${
        user.mfa_secret
      }&issuer=${encodeURIComponent(issuer)}`,
    };
  } else {
    // Generate secret baru
    const newSecret = speakeasy.generateSecret({
      name: user?.nama || "User",
      issuer,
      length: 16,
    });

    // Simpan ke database
    await updateProfile(parseInt(user.id), { mfa_secret: newSecret.base32 });

    secret = {
      base32: newSecret.base32,
      otpauth_url: newSecret.otpauth_url,
    };
  }

  return secret;
}

export function generateMfaSecret(label, issuer = "Survey Transjakarta") {
  return speakeasy.generateSecret({
    name: label,
    issuer,
    length: 16,
  });
}

export function verifyMfaToken(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1, // toleransi waktu 30 detik
  });
}

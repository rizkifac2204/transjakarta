import getLogs from "@/libs/getLogs";
import { parseJsonBody } from "@/utils/parseJsonBody";
import validateEmail from "@/utils/validateEmail";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";
import {
  createTestimoni,
  checkTestimoniExists,
  updateTestimoniByTiketAndEmail,
} from "@/libs/testimoni";
import verifyRecaptchaToken from "@/libs/verifyRecaptchaToken";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = parseJsonBody(body, {
      integerFields: ["rating", "permohonan_id", "penelitian_id"],
    });
    const {
      tiket,
      email,
      rating,
      komentar,
      permohonan_id,
      penelitian_id,
      token,
    } = parsed;

    if (!tiket || !email || !rating) {
      return Response.json(
        {
          message: "Lengkapi semua field yang harus diisi",
          error: "Required",
          success: false,
        },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    if (!token) {
      return Response.json(
        { status: "error", message: "Recaptcha Belum Siap" },
        { status: 400, headers: withCorsHeaders() }
      );
    }
    const captcha = await verifyRecaptchaToken(token, "submit_form");
    if (!captcha.success) {
      getLogs("publik").error(captcha);
      return Response.json(
        { status: "error", message: "Gagal Verifikasi" },
        { status: 404, headers: withCorsHeaders() }
      );
    }

    if (!validateEmail(email)) {
      return Response.json(
        { message: "Format email tidak valid", error: "InvalidEmail" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    const exists = await checkTestimoniExists(tiket, email);
    if (exists) {
      const result = await updateTestimoniByTiketAndEmail(tiket, email, {
        rating,
        komentar,
        permohonan_id,
        penelitian_id,
      });

      return Response.json(
        {
          message: "Testimoni berhasil diperbarui.",
          data: result,
        },
        { status: 201, headers: withCorsHeaders() }
      );
    } else {
      const result = await createTestimoni({
        tiket,
        email,
        rating,
        komentar,
        permohonan_id,
        penelitian_id,
      });

      revalidatePath(`/`);
      return Response.json(
        {
          message: "Testimoni berhasil disimpan.",
          data: result,
        },
        { status: 201, headers: withCorsHeaders() }
      );
    }
  } catch (error) {
    getLogs("publik").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500, headers: withCorsHeaders() }
    );
  }
}

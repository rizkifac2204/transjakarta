import getLogs from "@/libs/getLogs";
import askOpenAi from "@/libs/askOpenAI";

export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      return handlePOST(req, res);
    default:
      return res
        .status(405)
        .json({ message: "Metode tidak diizinkan", type: "error" });
  }
}

async function handlePOST(req, res) {
  try {
    let { pertanyaan } = req.body;

    if (!pertanyaan || pertanyaan.trim() === "") {
      return res.status(400).json({
        type: "error",
        message: "Pertanyaan wajib diisi",
      });
    }

    const response = await askOpenAi(pertanyaan);

    if (response.success) {
      return res.json({
        type: "success",
        message: response.message,
      });
    } else {
      return res.status(500).json({
        type: "error",
        message: response.message || "Gagal mendapatkan respons dari OpenAI",
      });
    }
  } catch (error) {
    getLogs("socket").error(error);
    return res
      .status(400)
      .json({ message: "Terjadi Kesalahan Sistem", type: "error" });
  }
}

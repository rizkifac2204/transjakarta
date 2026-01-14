import getLogs from "./getLogs";

export default async function askOpenAi(message) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_KEY}`,
          "HTTP-Referer": process.env.HOST,
          "X-Title": "Rizki",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "system",
              content: "Jawab Maksimal Satu Kalimat berupa teks",
            },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await response.json();
    const responseMessage = data.choices[0].message.content;

    return { success: true, message: responseMessage };
  } catch (error) {
    console.log(error);
    getLogs("askopenai").error(error);
    return { success: false, message: "Gagal mendapatkan respons dari OpenAI" };
  }
}

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mensagem é obrigatória." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é a Hanna, assistente de um centro de estética. Seja simpática, clara e ajude com agendamentos, dúvidas e informações.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const resposta = completion.choices[0].message.content;
    res.status(200).json({ resposta });
  } catch (error) {
    console.error("Erro na API OpenAI:", error?.response?.data || error.message);
    res.status(500).json({ error: "Erro ao conectar com a IA." });
  }
}

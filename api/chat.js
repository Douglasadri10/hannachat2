export default async function handler(req, res) {
  try {
    const { message } = req.body;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "Chave da API OpenAI não configurada." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Você é Hanna, uma atendente simpática e clara de um centro de estética. Sempre ajude o cliente com dúvidas e agendamentos.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da OpenAI:", data);
      return res.status(500).json({ error: "Erro da OpenAI", detalhe: data });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Erro geral:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("mensagemInput");
  const botao = document.getElementById("enviarBtn");
  const historico = document.getElementById("chatHistorico");

  const clienteId = "RP3D9Tkzc8VRU6qZoYdg"; // altere isso se quiser simular outros clientes

  function adicionarMensagem(texto, classe) {
    const linha = document.createElement("div");
    linha.className = `p-2 my-1 rounded-md ${classe}`;
    linha.textContent = texto;
    historico.appendChild(linha);
    historico.scrollTop = historico.scrollHeight;
  }

  botao.addEventListener("click", async () => {
    const mensagem = input.value.trim();
    if (!mensagem) return;

    adicionarMensagem(`Você: ${mensagem}`, "bg-blue-100 text-right");
    input.value = "";
    input.disabled = true;
    botao.disabled = true;

    try {
      const resposta = await fetch("https://us-central1-hannaai-b1877.cloudfunctions.net/responderMensagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem, clienteId })
      });

      const dados = await resposta.json();

      if (dados.resposta) {
        adicionarMensagem(`Hanna: ${dados.resposta}`, "bg-gray-100 text-left");
      } else {
        adicionarMensagem("Hanna: Ocorreu um erro ao responder.", "bg-red-100");
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);
      adicionarMensagem("Hanna: Erro de conexão ou servidor.", "bg-red-100");
    }

    input.disabled = false;
    botao.disabled = false;
    input.focus();
  });
});

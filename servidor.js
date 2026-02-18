const express = require("express");
const path = require("path");
const { abrirERegistrarURL } = require("./salvarAbrir");
const { listarURLs, deletarURL } = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/abrir", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith("http")) {
    return res.status(400).json({ mensagem: "URL inválida." });
  }

  try {
    await abrirERegistrarURL(url);
    res.json({
      mensagem: "✅ URL aberta e salva no banco de dados!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: "❌ Erro ao abrir/salvar: " + err.message });
  }
});

app.get("/historico", async (req, res) => {
  try {
    const urls = await listarURLs();
    res.json(urls);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar histórico: " + err.message });
  }
});

app.delete("/deletar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deletarURL(id);
    res.status(200).json({ sucesso: true });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    res.status(500).json({ erro: "Erro ao deletar" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando: http://localhost:${PORT}`);
});

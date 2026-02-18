function configurarFormulario() {
  const form = document.getElementById("form");
  const urlInput = document.getElementById("url");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = urlInput.value;

    try {
      const res = await fetch("/abrir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await res.json();
      
      urlInput.value = "";

      carregarHistorico();
    } catch (error) {
      console.error("Erro ao enviar URL:", error);
    }
  });
}

async function carregarHistorico() {
  try {
    const res = await fetch("/historico");
    const urls = await res.json();

    const corpoTabela = document.getElementById("lista-urls");
    corpoTabela.innerHTML = "";

    urls.forEach((item) => {
      const tr = document.createElement("tr");

      const tdUrl = document.createElement("td");
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = item.url;
      link.dataset.url = item.url;
      link.classList.add("url-link");

      tdUrl.appendChild(link);

      const tdData = document.createElement("td");
      tdData.textContent = new Date(item.data).toLocaleString();
      
      const tdAcao = document.createElement("td");
      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Excluir";
      btnExcluir.addEventListener("click", () => deletar(item.id));
      tdAcao.appendChild(btnExcluir);

      tr.appendChild(tdUrl);
      tr.appendChild(tdData);
      tr.appendChild(tdAcao);
      corpoTabela.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar histórico:", err);
  }

  document.querySelectorAll(".url-link").forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();

      const url = e.target.dataset.url;

      try {
        const res = await fetch("/abrir", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const result = await res.json();

        carregarHistorico();
      } catch (err) {
        alert("Erro ao abrir/salvar: " + err.message);
      }
    });
  });
}

async function deletar(id) {
  const confirmar = confirm("Deseja realmente excluir?");
  if (!confirmar) return;

  const res = await fetch(`/deletar/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    carregarHistorico();
  } else {
    alert("Erro ao excluir a URL.");
  }
}

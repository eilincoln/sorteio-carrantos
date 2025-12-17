let vencedores = [];

function sortear() {
  const texto = document.getElementById("nomes").value;
  const qtd = parseInt(document.getElementById("qtd").value);

  let nomes = texto
    .split("\n")
    .map((n) => n.trim())
    .filter((n) => n !== "");

  if (qtd > nomes.length) {
    alert("Quantidade maior que o número de nomes!");
    return;
  }

  // Embaralhamento justo
  for (let i = nomes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nomes[i], nomes[j]] = [nomes[j], nomes[i]];
  }

  vencedores = nomes.slice(0, qtd);

  // Mostrar resultado
  document.getElementById("resultado").textContent = vencedores
    .map((n, i) => `${i + 1}. ${n}`)
    .join("\n");

  // Criar registro do sorteio
  const registro = {
    dataHora: agora(),
    quantidade: qtd,
    vencedores: vencedores,
  };

  // Salvar no histórico
  let historico = JSON.parse(localStorage.getItem("historicoSorteios")) || [];
  historico.unshift(registro); // mais recente primeiro
  localStorage.setItem("historicoSorteios", JSON.stringify(historico));

  carregarHistorico();
}

function exportar() {
  if (vencedores.length === 0) {
    alert("Faça o sorteio primeiro!");
    return;
  }

  let csv = "Posição,Nome\n";
  vencedores.forEach((nome, i) => {
    csv += `${i + 1},"${nome}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "vencedores_sorteio.csv";
  a.click();

  URL.revokeObjectURL(url);
}

function carregarHistorico() {
  const historicoDiv = document.getElementById("historico");
  const historico = JSON.parse(localStorage.getItem("historicoSorteios")) || [];

  historicoDiv.innerHTML = "";

  historico.forEach((item, index) => {
    const bloco = document.createElement("div");
    bloco.className = "historico-item";

    bloco.innerHTML = `
      <strong>Sorteio em:</strong> ${item.dataHora}
      Quantidade: ${item.quantidade}<br>
      ${item.vencedores.join(", ")}
    `;

    historicoDiv.appendChild(bloco);
  });
}

// carregar ao abrir a página
carregarHistorico();

function agora() {
  const d = new Date();
  return d.toLocaleString("pt-BR");
}

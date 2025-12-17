let vencedores = [];
let ultimoId = "";

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

  document.getElementById("resultado").textContent = vencedores
    .map((n, i) => `${i + 1}. ${n}`)
    .join("\n");

  // gerar ID do sorteio
  ultimoId = gerarIdSorteio();

  const registro = {
    id: ultimoId,
    dataHora: agora(),
    quantidade: qtd,
    vencedores: vencedores,
  };

  let historico = JSON.parse(localStorage.getItem("historicoSorteios")) || [];
  historico.unshift(registro);
  localStorage.setItem("historicoSorteios", JSON.stringify(historico));

  carregarHistorico();
}

function exportarCSV() {
  if (vencedores.length === 0) {
    alert("Faça o sorteio primeiro!");
    return;
  }

  let csv = "ID do Sorteio,Posição,Nome\n";

  vencedores.forEach((nome, i) => {
    csv += `${ultimoId},${i + 1},"${nome}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "resultado_sorteio.csv";
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
  <strong>ID:</strong> ${item.id}<br>
  <strong>Data:</strong> ${item.dataHora}<br>
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

function contarNomes() {
  const texto = document.getElementById("nomes").value;

  const total = texto
    .split("\n")
    .map((n) => n.trim())
    .filter((n) => n !== "").length;

  const span = document.getElementById("totalNomes");
  span.textContent = total;

  if (total === 0) span.style.color = "#ef4444";
  else if (total < 10) span.style.color = "#facc15";
  else span.style.color = "#22c55e";
}

// Função para registro das informação de ID para cada sorteio
function gerarIdSorteio() {
  const agora = new Date();
  const data = agora.toISOString().replace(/[-:.TZ]/g, "");
  const random = Math.floor(Math.random() * 1000);
  return `SRT-${data}-${random}`;
}

//função para poder exportar o arquivo em PDF:
function exportarPDF() {
  if (vencedores.length === 0) {
    alert("Faça o sorteio primeiro!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Resultado do Sorteio", 20, 20);

  doc.setFontSize(10);
  doc.text(`ID do Sorteio: ${ultimoId}`, 20, 30);
  doc.text(`Data e Hora: ${agora()}`, 20, 36);

  let y = 50;
  vencedores.forEach((nome, i) => {
    doc.text(`${i + 1}. ${nome}`, 20, y);
    y += 6;

    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("resultado_sorteio.pdf");
}

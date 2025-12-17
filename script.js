let vencedores = [];
let ultimoId = "";

function sortear() {
  const texto = document.getElementById("nomes").value;
  const qtd = parseInt(document.getElementById("qtd").value);

  const listaSorteados = document.getElementById("listaSorteados");
  const listaNaoSorteados = document.getElementById("listaNaoSorteados");

  // limpar listas
  listaSorteados.innerHTML = "";
  listaNaoSorteados.innerHTML = "";

  let nomes = texto
    .split("\n")
    .map((n) => n.trim())
    .filter((n) => n !== "");

  if (qtd > nomes.length || nomes.length === 0) {
    alert("Quantidade inválida de nomes!");
    return;
  }

  // Embaralhamento justo (Fisher-Yates)
  for (let i = nomes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nomes[i], nomes[j]] = [nomes[j], nomes[i]];
  }

  // definir vencedores
  vencedores = nomes.slice(0, qtd);

  // mostrar resultado simples
  document.getElementById("resultado").textContent = vencedores
    .map((n, i) => `${i + 1}. ${n}`)
    .join("\n");

  // ===== COMPARAÇÃO =====
  const setVencedores = new Set(vencedores);

  vencedores.forEach((nome) => {
    const li = document.createElement("li");
    li.textContent = nome;
    li.className = "ok-item";
    listaSorteados.appendChild(li);
  });

  nomes.forEach((nome) => {
    if (!setVencedores.has(nome)) {
      const li = document.createElement("li");
      li.textContent = nome;
      li.className = "no-item";
      listaNaoSorteados.appendChild(li);
    }
  });

  // gerar ID do sorteio
  ultimoId = gerarIdSorteio();

  const registro = {
    id: ultimoId,
    dataHora: agora(),
    quantidadeSorteados: vencedores.length,
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

  let csv = "Nome\n";

  vencedores.forEach((nome) => {
    csv += `"${nome}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ganhadores_sorteio.csv";
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

    const limite = 3;
    const vencedoresVisiveis = item.vencedores.slice(0, limite);
    const vencedoresOcultos = item.vencedores.slice(limite);

    bloco.innerHTML = `
  <strong>ID:</strong> ${item.id}<br>
  <strong>Data:</strong> ${item.dataHora}<br>
  <strong>Quantidade de ganhadores:</strong> ${item.quantidadeSorteados}<br><br>

  <strong>Ganhadores:</strong>
  <span class="vencedores-curtos">
    ${vencedoresVisiveis.join(", ")}
    ${
      vencedoresOcultos.length > 0
        ? ` <em>(+${vencedoresOcultos.length})</em>`
        : ""
    }
  </span>

  ${
    vencedoresOcultos.length > 0
      ? `<span class="vencedores-completos" style="display:none;">
           ${item.vencedores.join(", ")}
         </span>
         <br>
         <button class="btn-vermais">Ver mais</button>`
      : ""
  }
`;

    const btn = bloco.querySelector(".btn-vermais");

    if (btn) {
      btn.addEventListener("click", () => {
        const curto = bloco.querySelector(".vencedores-curtos");
        const completo = bloco.querySelector(".vencedores-completos");

        const aberto = completo.style.display === "inline";

        completo.style.display = aberto ? "none" : "inline";
        curto.style.display = aberto ? "inline" : "none";

        btn.textContent = aberto ? "Ver mais" : "Ver menos";
      });
    }

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

  const texto = document.getElementById("nomes").value;
  const nomes = texto
    .split("\n")
    .map((n) => n.trim())
    .filter((n) => n !== "");

  const setVencedores = new Set(vencedores);
  const naoSorteados = nomes.filter((n) => !setVencedores.has(n));

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Resultado do Sorteio – Grupo Carrantos", 20, 20);

  doc.setFontSize(10);
  doc.text(`ID do Sorteio: ${ultimoId}`, 20, 30);
  doc.text(`Data e Hora: ${agora()}`, 20, 36);
  doc.text(`Quantidade de ganhadores: ${vencedores.length}`, 20, 42);

  let y = 56;

  doc.setFontSize(12);
  doc.text("GANHADORES", 20, y);
  y += 8;

  doc.setFontSize(10);
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

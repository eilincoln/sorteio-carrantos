# 🎲 Sorteador de Nomes – Grupo Carrantos

Sistema web para sorteio aleatório de nomes em grande escala, desenvolvido com **HTML, CSS e JavaScript puro**, focado em **transparência, rastreabilidade e confiabilidade**.

Projetado para sorteios corporativos, eventos internos e processos que exigem registro claro e verificável.

---

## 🚀 Funcionalidades

- Sorteio aleatório justo (embaralhamento Fisher-Yates)
- Suporte a grandes volumes de nomes (2.500+)
- Definição da quantidade de sorteados
- Contador visual de nomes inseridos
- Geração automática de **ID único por sorteio**
- Registro de **data e hora**
- Histórico persistente de sorteios
- Armazenamento local (LocalStorage)
- Exportação de resultados em:
  - 📄 PDF
  - 📊 CSV
- Interface moderna com tema escuro corporativo

---

## 🧠 Persistência de Dados

Os dados dos sorteios são armazenados utilizando **LocalStorage do navegador**:

- Persistem após recarregar ou fechar a página
- Não são enviados para servidores externos
- Permanecem até limpeza manual do cache do navegador

---

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- jsPDF

---

## ▶️ Como utilizar

1. Abra o arquivo `index.html` no navegador
2. Insira os nomes (um por linha)
3. Defina a quantidade de sorteados
4. Clique em **Sortear**
5. Consulte o histórico ou exporte os resultados

---

## 🔒 Transparência do Sorteio

Cada sorteio gera automaticamente:

- Um identificador único
- Data e hora do sorteio
- Registro imutável no histórico local

Isso garante **clareza, rastreabilidade e confiança** no processo.

---

## 📈 Melhorias Futuras

- Tema claro / escuro
- Importação de arquivos `.csv` ou `.xlsx`
- Exportação do histórico completo
- Assinatura de integridade do sorteio
- Controle de acesso por usuário

---

## 👤 Autor

**Lincoln Berto**  
Projeto desenvolvido para uso interno e evolução contínua em desenvolvimento web.

---

## 📄 Licença

Uso livre para fins internos, educacionais e de aprendizado.

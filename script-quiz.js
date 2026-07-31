// BANCO DE QUESTÕES (14 Questões, 7 Temas)
const questoes = [
  // --- CORES PRIMÁRIAS ---
  { tema: "Cores Primárias", p: "Quais são as três cores primárias na teoria clássica dos pigmentos?", opcoes: ["Verde, Laranja e Roxo", "Vermelho, Amarelo e Azul", "Branco, Preto e Cinza"], correta: 1 },
  { tema: "Cores Primárias", p: "O que define essencialmente uma cor primária?", opcoes: ["São cores que não podem ser criadas pela mistura de outras.", "São criadas pela mistura de cores complementares.", "São as cores mais escuras do círculo cromático."], correta: 0 },
  // --- CORES SECUNDÁRIAS ---
  { tema: "Cores Secundárias", p: "Qual cor secundária obtemos ao misturar Azul e Amarelo?", opcoes: ["Roxo", "Laranja", "Verde"], correta: 2 },
  { tema: "Cores Secundárias", p: "Como uma cor secundária é tecnicamente formada?", opcoes: ["Adicionando branco a uma cor primária.", "Pela mistura em partes iguais de duas cores primárias.", "Misturando todas as cores do círculo cromático."], correta: 1 },
  // --- CORES COMPLEMENTARES ---
  { tema: "Cores Complementares", p: "Onde as cores complementares se localizam no círculo cromático?", opcoes: ["Lado a lado, sendo vizinhas.", "Em posições diametralmente opostas.", "Apenas no centro do círculo."], correta: 1 },
  { tema: "Cores Complementares", p: "O que acontece visualmente quando colocamos duas cores complementares lado a lado?", opcoes: ["Elas geram o máximo de contraste e vibração.", "Elas se anulam e parecem cinza.", "Elas diminuem a luminosidade da arte."], correta: 0 },
  // --- MONOCROMIA ---
  { tema: "Monocromia", p: "O que caracteriza uma paleta monocromática?", opcoes: ["Uso de cores opostas no círculo cromático.", "Exploração de diferentes tons, brilhos e saturações de uma única cor base.", "Mistura de cores quentes e frias."], correta: 1 },
  { tema: "Monocromia", p: "Como se altera a luminosidade (fazer sub-tons) em uma composição monocromática?", opcoes: ["Adicionando apenas a cor amarela.", "Misturando a cor base com suas vizinhas.", "Adicionando pigmento branco ou preto à cor base."], correta: 2 },
  // --- POLICROMIA ---
  { tema: "Policromia", p: "O que significa criar uma obra com estética policromática?", opcoes: ["Usar múltiplas cores diferentes e variadas na mesma composição.", "Usar apenas cores com pigmentação escura.", "Fazer uma arte inteira em preto e branco."], correta: 0 },
  { tema: "Policromia", p: "Qual a principal vantagem de utilizar uma paleta policromática?", opcoes: ["Garantir que a imagem pareça triste e calma.", "Criar visuais altamente complexos, ricos e dinâmicos.", "Facilitar a impressão limitando os pigmentos."], correta: 1 },
  // --- CORES QUENTES ---
  { tema: "Cores Quentes", p: "Quais sensações as cores quentes geralmente transmitem ao observador?", opcoes: ["Frio, distanciamento e sombras.", "Calor, energia, vibração e proximidade.", "Neutralidade e invisibilidade."], correta: 1 },
  { tema: "Cores Quentes", p: "Assinale a alternativa que contém apenas cores quentes tradicionais:", opcoes: ["Vermelho, Laranja e Amarelo.", "Azul, Verde e Violeta.", "Cinza, Branco e Marrom."], correta: 0 },
  // --- CORES FRIAS ---
  { tema: "Cores Frias", p: "Qual grupo representa a base das cores frias no círculo cromático?", opcoes: ["Vermelho, Rosa e Laranja.", "Azul, Verde e Violeta.", "Amarelo, Ouro e Cobre."], correta: 1 },
  { tema: "Cores Frias", p: "Em design e curadoria visual, as cores frias são frequentemente aplicadas para:", opcoes: ["Chamar atenção para alertas de perigo imediato.", "Evocar calma, frescor, profundidade e relaxamento.", "Aumentar a sensação de fome em restaurantes."], correta: 1 }
];

// VARIÁVEIS DE ESTADO
let questaoAtual = 0;
let acertosTemaAtual = 0;
let relatorioFinal = [];
let acertosTotais = 0;

function mostrarTela(id) {
  document.querySelectorAll('.card-modal').forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function iniciarQuiz() {
  // Restore a BGM do Quiz caso o jogador reinicie vindo da tela de créditos
  if (typeof trocarBGM === 'function') {
    trocarBGM('Audio/bgm-quiz.mp3');
  }
  questaoAtual = 0;
  acertosTotais = 0;
  acertosTemaAtual = 0;
  relatorioFinal = [];
  mostrarQuestao();
  mostrarTela('tela-quiz');
}

function mostrarQuestao() {
  const q = questoes[questaoAtual];
  document.getElementById('badge-tema').innerText = q.tema;
  document.getElementById('contador-questao').innerText = `${questaoAtual + 1}/${questoes.length}`;
  document.getElementById('texto-pergunta').innerText = q.p;

  const containerOpcoes = document.getElementById('opcoes-container');
  containerOpcoes.innerHTML = '';

  // 1. Cria um array com os números [0, 1, 2] (índices originais)
  let indicesEmbaralhados = q.opcoes.map((_, index) => index);

  // 2. Embaralha esses números aleatoriamente (Algoritmo Fisher-Yates)
  for (let i = indicesEmbaralhados.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indicesEmbaralhados[i], indicesEmbaralhados[j]] = [indicesEmbaralhados[j], indicesEmbaralhados[i]];
  }

  // 3. Cria os botões usando a ordem embaralhada
  indicesEmbaralhados.forEach(indiceOriginal => {
    const btn = document.createElement('button');
    btn.className = 'opcao-btn';
    
    // Pega o texto da opção baseada no índice original
    btn.innerText = q.opcoes[indiceOriginal];
    
    btn.onclick = () => {
      if (typeof tocarSom === 'function') tocarSom('click');
      
      // Compara o índice original com a resposta correta registrada no banco
      registrarResposta(indiceOriginal, q.correta, q.tema);
    };
    
    containerOpcoes.appendChild(btn);
  });
}

function registrarResposta(escolha, correta, tema) {
  if (escolha === correta) {
    acertosTemaAtual++;
    acertosTotais++;
  }

  if (questaoAtual % 2 !== 0) {
    relatorioFinal.push({ tema: tema, acertos: acertosTemaAtual });
    prepararFeedback();
  } else {
    questaoAtual++;
    mostrarQuestao();
  }
}

function prepararFeedback() {
  const titulo = document.getElementById('feedback-titulo');
  const texto = document.getElementById('feedback-texto');
  const tema = questoes[questaoAtual].tema;

  titulo.innerText = `Análise: ${tema}`;

  if (acertosTemaAtual === 2) {
    if (typeof tocarSom === 'function') tocarSom('acerto');
    texto.innerText = "Perfeito! Você dominou completamente este conceito. (2/2 Acertos)";
    texto.style.color = "var(--success)";
  } else if (acertosTemaAtual === 1) {
    if (typeof tocarSom === 'function') tocarSom('acerto');
    texto.innerText = "Bom, mas pode melhorar. Revise a teoria deste conceito. (1/2 Acertos)";
    texto.style.color = "var(--gold)";
  } else {
    if (typeof tocarSom === 'function') tocarSom('erro');
    texto.innerText = "Atenção necessária! Sua curadoria falhou neste tema. (0/2 Acertos)";
    texto.style.color = "var(--error)";
  }

  mostrarTela('tela-feedback');
}

function proximaPergunta() {
  if (typeof tocarSom === 'function') tocarSom('click');
  acertosTemaAtual = 0; 
  questaoAtual++;

  if (questaoAtual < questoes.length) {
    mostrarQuestao();
    mostrarTela('tela-quiz');
  } else {
    gerarPenteFino();
    mostrarTela('tela-resultado');
  }
}

function gerarPenteFino() {
  document.getElementById('nota-total').innerText = `${acertosTotais}/14`;
  const container = document.getElementById('pente-fino-container');
  container.innerHTML = '';

  relatorioFinal.forEach(item => {
    let classeCor = 'p-ruim';
    if(item.acertos === 2) classeCor = 'p-boa';
    if(item.acertos === 1) classeCor = 'p-media';

    container.innerHTML += `
      <div class="linha-resultado">
        <span>${item.tema}</span>
        <span class="pontuacao-badge ${classeCor}">${item.acertos}/2</span>
      </div>
    `;
  });
}

function mostrarCreditos() {
  // 🎵 Troca a BGM do Quiz pela BGM de Créditos usando o AudioManager
  if (typeof trocarBGM === 'function') {
    trocarBGM('Audio/bgm-creditos.mp3');
  }
  mostrarTela('tela-creditos');
}

// Função para voltar para a fase de cores quente e fria
function backToCores() {
  if (typeof pararBGM === 'function') {
    pararBGM();
  }
  window.location.href = 'cores.html';
}
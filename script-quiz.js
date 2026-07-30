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

// CONTROLE DE MÚSICA DE FUNDO DOS CRÉDITOS
let musicaCreditos = null;

function pararMusicaCreditos() {
  if (musicaCreditos) {
    musicaCreditos.pause();
    musicaCreditos.currentTime = 0;
  }
}

function mostrarTela(id) {
  document.querySelectorAll('.card-modal').forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function iniciarQuiz() {
  pararMusicaCreditos(); // Garante que se estivesse nos créditos, a música pare ao reiniciar
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

  q.opcoes.forEach((opcaoTexto, index) => {
    const btn = document.createElement('button');
    btn.className = 'opcao-btn';
    btn.innerText = opcaoTexto;
    btn.onclick = () => {
      if (typeof tocarSom === 'function') tocarSom('click');
      registrarResposta(index, q.correta, q.tema);
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
    // 1. 🛑 PARAR A MÚSICA DE FUNDO DO QUIZ / PÁGINA
    
    // Se o seu script-audio.js tiver uma função de parar BGM, ele chama aqui:
    if (typeof pararBGM === 'function') pararBGM();
    if (typeof pausarBGM === 'function') pausarBGM();

    // Se a música for uma tag <audio> no HTML, pausa todas:
    document.querySelectorAll('audio').forEach(a => {
        a.pause();
        a.currentTime = 0;
    });

    // Se o script-audio.js usou uma variável global no window:
    if (window.bgm) { window.bgm.pause(); window.bgm.currentTime = 0; }
    if (window.audioBGM) { window.audioBGM.pause(); window.audioBGM.currentTime = 0; }
    if (window.currentBGM) { window.currentBGM.pause(); window.currentBGM.currentTime = 0; }

    // -------------------------------------------------------------

    // 2. 🎵 TOCAR APENAS A MÚSICA DOS CRÉDITOS
    pararMusicaCreditos(); // Reseta se já estava tocando
  
    const srcCreditos = (typeof sfxMap !== 'undefined' && sfxMap['creditos']) ? sfxMap['creditos'] : 'Audio/bgm-creditos.mp3';
  
    musicaCreditos = new Audio(srcCreditos);
    musicaCreditos.loop = true;
    musicaCreditos.play().catch(err => console.warn("Erro ao tocar música de créditos:", err));

    mostrarTela('tela-creditos');
}

// Função para voltar para a fase de cores quente e fria
function backToCores() {
  pararMusicaCreditos(); // Para a música dos créditos ao sair da página
  window.location.href = 'cores.html';
}
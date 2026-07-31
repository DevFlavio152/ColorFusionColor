// Baralho de Cartas (3 Primárias e 9 Secundárias/Terciárias como pegadinha)
const deckCores = [
    // As 3 Primárias (As respostas certas)
    { id: 'vermelho', nome: 'Vermelho', hex: '#ff4757', ePrimaria: true },
    { id: 'azul', nome: 'Azul', hex: '#2e86de', ePrimaria: true },
    { id: 'amarelo', nome: 'Amarelo', hex: '#ffff00', ePrimaria: true },
    
    // Pegadinhas (Cores secundárias, terciárias e neutras)
    { id: 'verde', nome: 'Verde', hex: '#27ae60', ePrimaria: false },
    { id: 'laranja', nome: 'Laranja', hex: '#e67e22', ePrimaria: false },
    { id: 'roxo', nome: 'Roxo', hex: '#8e44ad', ePrimaria: false },
    { id: 'rosa', nome: 'Rosa', hex: '#fd79a8', ePrimaria: false },
    { id: 'marrom', nome: 'Marrom', hex: '#8d6e63', ePrimaria: false },
    { id: 'ciano', nome: 'Ciano', hex: '#00cec9', ePrimaria: false },
    { id: 'verde-limao', nome: 'Verde Limão', hex: '#badc58', ePrimaria: false },
    { id: 'magenta', nome: 'Magenta', hex: '#e84393', ePrimaria: false },
    { id: 'pessego', nome: 'Pêssego', hex: '#fab1a0', ePrimaria: false }
];

let primariasEncontradas = 0;
let cartaAtualSelecionada = null;
let indexCartaAtual = null;

window.onload = () => {
    embaralhar(deckCores);
    gerarCartas();
};

function fecharIntro() {
    document.getElementById('intro-modal').style.display = 'none';
}

function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function gerarCartas() {
    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '';

    deckCores.forEach((cor, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.id = `card-${index}`;
        cardDiv.onclick = () => virarCarta(index, cor);

        cardDiv.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back" style="background-color: ${cor.hex};"></div>
            </div>
        `;
        grid.appendChild(cardDiv);
    });
}

function virarCarta(index, cor) {
    tocarSom('carta');
    const cardElement = document.getElementById(`card-${index}`);
    
    // Evita clicar em cartas já viradas ou desativadas
    if (cardElement.classList.contains('flipped') || cardElement.classList.contains('disabled')) return;

    // Vira a carta
    cardElement.classList.add('flipped');
    
    cartaAtualSelecionada = cor;
    indexCartaAtual = index;

    // Aguarda a animação da carta terminar (600ms) para exibir a pergunta
    setTimeout(() => {
        abrirPergunta(cor);
    }, 600);
}

function abrirPergunta(cor) {
    const modal = document.getElementById('question-modal');
    document.getElementById('cor-revelada-display').style.background = cor.hex;
    document.getElementById('cor-revelada-nome').innerText = cor.nome;
    modal.style.display = 'flex';
}

function responderPergunta(respostaDoJogadorSim) {
    
    document.getElementById('question-modal').style.display = 'none';
    const cardElement = document.getElementById(`card-${indexCartaAtual}`);
    
    let acertou = false;
    let titulo = "";
    let mensagem = "";
    let corDoTexto = "";

    // LÓGICA DO JOGO
    if (respostaDoJogadorSim === true && cartaAtualSelecionada.ePrimaria === true) {
        tocarSom('acerto');
        // Disse SIM para uma Primária = SUCESSO!
        acertou = true;
        titulo = "Exato!";
        mensagem = `O ${cartaAtualSelecionada.nome} é uma Cor Primária pura!`;
        corDoTexto = "#22c55e"; // Verde
        
        preencherCirculo(cartaAtualSelecionada);
        cardElement.classList.add('disabled'); // Carta fica virada e bloqueada
        primariasEncontradas++;

    } else if (respostaDoJogadorSim === false && cartaAtualSelecionada.ePrimaria === false) {
        tocarSom('acerto');
        // Disse NÃO para uma Secundária = SUCESSO (Não caiu na pegadinha)
        acertou = true;
        titulo = "Boa percepção!";
        mensagem = `O ${cartaAtualSelecionada.nome} NÃO é primário, ele é uma mistura.`;
        corDoTexto = "#22c55e"; 
        
        cardElement.classList.add('disabled'); 

    } else if (respostaDoJogadorSim === true && cartaAtualSelecionada.ePrimaria === false) {
        tocarSom('erro');
        // Disse SIM para uma Secundária = ERRO!
        acertou = false;
        titulo = "Cuidado com a pegadinha!";
        mensagem = `O ${cartaAtualSelecionada.nome} NÃO é primário. Ele é gerado por mistura!`;
        corDoTexto = "#ef4444"; // Vermelho
        
        cardElement.classList.remove('flipped'); // Desvira a carta para tentar de novo

    } else if (respostaDoJogadorSim === false && cartaAtualSelecionada.ePrimaria === true) {
        // Disse NÃO para uma Primária = ERRO!
        acertou = false;
        titulo = "Ops!";
        mensagem = `O ${cartaAtualSelecionada.nome} É SIM uma Cor Primária! Não a descarte.`;
        corDoTexto = "#ef4444"; 
        
        cardElement.classList.remove('flipped'); 
    }

    // Exibe o feedback rápido
    exibirFeedback(titulo, mensagem, corDoTexto);
}

function preencherCirculo(cor) {
    const slot = document.getElementById(`slot-${cor.id}`);
    if (slot) {
        slot.style.background = cor.hex;
        slot.style.color = cor.hex; // Usado para o brilho do box-shadow
        slot.classList.add('filled');
    }
}

function exibirFeedback(titulo, texto, cor) {
    const modal = document.getElementById('feedback-modal');
    const toast = document.getElementById('feedback-toast');
    
    document.getElementById('feedback-title').innerText = titulo;
    document.getElementById('feedback-title').style.color = cor;
    document.getElementById('feedback-text').innerText = texto;
    
    modal.style.display = 'flex';

    // O feedback some sozinho após 2.5 segundos
    setTimeout(() => {
        modal.style.display = 'none';
        
        // Se encontrou as 3, chama a vitória
        if (primariasEncontradas === 3) {
            tocarSom('vitoria');
            document.getElementById('victory-modal').style.display = 'flex';
        }
    }, 2500);
}

function avancarParaFase2() {
    let progressoAtual = parseInt(sessionStorage.getItem('progressoColorFusion')) || 1;
    if (progressoAtual < 2) {
        sessionStorage.setItem('progressoColorFusion', '2');
    }

    sessionStorage.setItem('voltarParaOMapa', 'true');
    window.location.href = "index.html?map=true";
}

// Função para voltar da Fase 1 para o Mapa Principal
function backToMap() {
    // Redireciona para o index.html com o parâmetro map=true para abrir o mapa direto
    window.location.href = 'index.html?map=true';
}
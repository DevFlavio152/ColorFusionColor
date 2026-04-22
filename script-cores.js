//==================================================
// BASE DE DADOS DE IMAGENS (COLADAS DIRETAMENTE AQUI)
//==================================================
let imagensFull = [
    { id: 1, temp: 'quente', url: 'https://images.unsplash.com/photo-1641988760815-8e641a692e7f?w=500&auto=format&fit=crop&q=60' },
    { id: 2, temp: 'quente', url: 'https://images.unsplash.com/photo-1642100817658-7decd438e197?w=500&auto=format&fit=crop&q=60' },
    { id: 3, temp: 'quente', url: 'https://plus.unsplash.com/premium_photo-1673264933122-40a42e8f7fb9?w=500&auto=format&fit=crop&q=60' },
    { id: 4, temp: 'quente', url: 'https://media.istockphoto.com/id/2218576866/pt/foto/modern-living-room-with-air-conditioner-sofa-potted-plant-and-yellow-wall.webp?a=1&b=1&s=612x612&w=0&k=20&c=oAPKgut0Cvk2xUAde-YrBq5Lsc5I4OMXK9Kd6T1e9DM=' },
    { id: 5, temp: 'frio', url: 'https://images.unsplash.com/photo-1639236868082-0d9dec50c1b0?w=500&auto=format&fit=crop&q=60' },
    { id: 6, temp: 'frio', url: 'https://plus.unsplash.com/premium_photo-1666855258034-8d2c36091ec1?w=500&auto=format&fit=crop&q=60' },
    { id: 7, temp: 'frio', url: 'https://images.unsplash.com/photo-1731742371841-06f893f01890?w=500&auto=format&fit=crop&q=60' },
    { id: 8, temp: 'frio', url: 'https://images.unsplash.com/photo-1647805907297-026022540cc5?w=500&auto=format&fit=crop&q=60' },
    { id: 9, temp: 'frio', url: 'https://plus.unsplash.com/premium_photo-1707398410328-c16450b3da63?w=500&auto=format&fit=crop&q=60' },
    { id: 10, temp: 'quente', url: 'https://images.unsplash.com/photo-1639005192832-f9fdbc8701b7?w=500&auto=format&fit=crop&q=60' },
    { id: 11, temp: 'quente', url: 'https://images.unsplash.com/photo-1666267818610-b656b06ee9f1?w=500&auto=format&fit=crop&q=60' },
    { id: 12, temp: 'frio', url: 'https://images.unsplash.com/photo-1686858230770-026ae5bb6772?w=500&auto=format&fit=crop&q=60' },
    { id: 13, temp: 'frio', url: 'https://images.unsplash.com/photo-1614614630790-98c6b4f8597b?w=500&auto=format&fit=crop&q=60' },
    { id: 14, temp: 'quente', url: 'https://images.unsplash.com/photo-1742475902575-93375deb9ada?w=500&auto=format&fit=crop&q=60' },
    { id: 15, temp: 'frio', url: 'https://plus.unsplash.com/premium_photo-1661897340950-fe778dc5d676?w=500&auto=format&fit=crop&q=60' },
    { id: 16, temp: 'frio', url: 'https://images.unsplash.com/photo-1615388598927-c1ad4f37c548?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvciUyMGZyaWF8ZW58MHx8MHx8fDA%3D' }
];

let etapaAtual = 1;
let selecionados = new Set();

function iniciarJogo() {
    document.getElementById('card-intro').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    // Aqui não chamamos mais o google.script! Apenas iniciamos o grid.
    renderizarGrid();
}

function renderizarGrid() {
    const grid = document.getElementById('grid-captcha');
    grid.innerHTML = '';
    selecionados.clear();
    document.getElementById('feedback').innerText = '';
    
    // 1. Embaralha
    const imagensEmbaralhadas = [...imagensFull].sort(() => Math.random() - 0.5);
    
    // 2. Cria as imagens
    imagensEmbaralhadas.forEach(img => {
        const div = document.createElement('div');
        div.className = 'item-grid';
        div.innerHTML = `<img src="${img.url}">`;
        
        div.onclick = () => {
            if (selecionados.has(img.id)) {
                selecionados.delete(img.id);
                div.classList.remove('selected');
            } else {
                selecionados.add(img.id);
                div.classList.add('selected');
            }
        };
        grid.appendChild(div);
    });
    
    // 3. Define textos da etapa
    const titulo = document.getElementById('titulo-etapa');
    const instrucao = document.getElementById('instrucao');
    
    if (etapaAtual === 1) {
        titulo.innerText = 'Etapa 1: Radar Quente';
        instrucao.innerHTML = 'Selecione todas as <strong>Cores Quentes</strong>.';
    } else {
        titulo.innerText = 'Etapa 2: Zona Fria';
        instrucao.innerHTML = 'Selecione todas as <strong>Cores Frias</strong>.';
    }
    
    // Mostramos o container do botão
    const footer = document.getElementById('footer-acoes');
    footer.setAttribute('style', 'display: flex !important; justify-content: center !important;');
}

function verificarSelecao() {
    const objetivo = (etapaAtual === 1) ? 'quente' : 'frio';
    const corretosNoPool = imagensFull.filter(img => img.temp === objetivo).map(img => img.id);
    const selecionadosArray = Array.from(selecionados);
    const acertoTotal = selecionadosArray.length === corretosNoPool.length && selecionadosArray.every(id => corretosNoPool.includes(id));
    
    const feedback = document.getElementById('feedback');
    
    if (acertoTotal) {
        feedback.style.color = '#28a745';
        feedback.innerText = 'Perfeito! Analisando próxima etapa...';
        
        setTimeout(() => {
            if (etapaAtual === 1) {
                etapaAtual = 2;
                renderizarGrid();
            } else {
                document.getElementById('game-container').style.display = 'none';
                document.getElementById('card-sucesso').style.display = 'block';
            }
        }, 1200);
    } else {
        feedback.style.color = '#ff4444';
        feedback.innerText = 'Sua análise falhou. Tente novamente.';
    }
}

function reiniciarTudo() {
    etapaAtual = 1;
    selecionados.clear();
    document.getElementById('card-sucesso').style.display = 'none';
    iniciarJogo();
}

function voltarAoMapaFinal() {
    // Viaja de volta para o Jogo Principal
    window.location.href = "index.html";
}
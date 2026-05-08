// --- RESPONSIVIDADE ABSOLUTA: CÁLCULO DE ALTURA MOBILE ---
function ajustarAlturaMobile() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Adicione isso para garantir que o iOS recalcule após o carregamento completo
window.addEventListener('load', () => {
    setTimeout(ajustarAlturaMobile, 300);
});

// Forçar o redesenho dos SVGs para o Safari
    document.querySelectorAll('svg').forEach(svg => {
        svg.style.display = 'none';
        svg.offsetHeight; // Truque para forçar o navegador a recalcular
        svg.style.display = 'block';
    });
// Executa na inicialização e sempre que a tela girar/mudar
ajustarAlturaMobile();
window.addEventListener('resize', ajustarAlturaMobile);

    // --- DADOS GLOBAIS ---
    const listaCores = [
        {hex: '#4a148c', grupo: 'VIOLET'}, {hex: '#7b1fa2', grupo: 'VIOLET'}, {hex: '#9c27b0', grupo: 'VIOLET'}, {hex: '#ba68c8', grupo: 'VIOLET'}, {hex: '#d1c4e9', grupo: 'VIOLET'}, {hex: '#e1bee7', grupo: 'VIOLET'},
        {hex: '#1b5e20', grupo: 'GREEN'}, {hex: '#388e3c', grupo: 'GREEN'}, {hex: '#4caf50', grupo: 'GREEN'}, {hex: '#81c784', grupo: 'GREEN'}, {hex: '#c8e6c9', grupo: 'GREEN'}, {hex: '#a5d6a7', grupo: 'GREEN'},
        {hex: '#b71c1c', grupo: 'RED'}, {hex: '#d32f2f', grupo: 'RED'}, {hex: '#f44336', grupo: 'RED'}, {hex: '#e57373', grupo: 'RED'}, {hex: '#ffcdd2', grupo: 'RED'}, {hex: '#ff8a80', grupo: 'RED'},
        {hex: '#0d47a1', grupo: 'BLUE'}, {hex: '#1976d2', grupo: 'BLUE'}, {hex: '#2196f3', grupo: 'BLUE'}, {hex: '#64b5f6', grupo: 'BLUE'}, {hex: '#bbdefb', grupo: 'BLUE'}, {hex: '#80d8ff', grupo: 'BLUE'},
        {hex: '#e65100', grupo: 'ORANGE'}, {hex: '#f57c00', grupo: 'ORANGE'}, {hex: '#ff9800', grupo: 'ORANGE'}, {hex: '#ffb74d', grupo: 'ORANGE'}, {hex: '#ffe0b2', grupo: 'ORANGE'}, {hex: '#ffcc80', grupo: 'ORANGE'},
        {hex: '#880e4f', grupo: 'PINK'}, {hex: '#c2185b', grupo: 'PINK'}, {hex: '#e91e63', grupo: 'PINK'}, {hex: '#f06292', grupo: 'PINK'}, {hex: '#f8bbd0', grupo: 'PINK'}, {hex: '#f48fb1', grupo: 'PINK'},
        {hex: '#006064', grupo: 'CYAN'}, {hex: '#0097a7', grupo: 'CYAN'}, {hex: '#00bcd4', grupo: 'CYAN'}, {hex: '#4dd0e1', grupo: 'CYAN'}, {hex: '#b2ebf2', grupo: 'CYAN'}, {hex: '#80deea', grupo: 'CYAN'},
        {hex: '#f57f17', grupo: 'YELLOW'}, {hex: '#fbc02d', grupo: 'YELLOW'}, {hex: '#ffeb3b', grupo: 'YELLOW'}, {hex: '#fff176', grupo: 'YELLOW'}, {hex: '#fff9c4', grupo: 'YELLOW'}, {hex: '#fff59d', grupo: 'YELLOW'}
    ];

    let selectedPart = null;
    let paintedParts1 = new Map();
    let paintedParts2 = new Map();
    let mandala1Finished = false;
    let mandala2Finished = false;
    let isPanningMap = false; 

    // --- NOVO: LÓGICA DE ESCOLHA DE DISPOSITIVO ---
    function escolherDispositivo(tipo) {
        document.getElementById('modal-device-selection').style.display = 'none';
        
        if(tipo === 'mobile') {
            document.body.classList.add('mobile-mode'); // Ativa a mágica do carrossel mobile
        }
        
        // Depois que escolheu, mostra o inicio do jogo
        document.getElementById('modal-intro-1').style.display = 'flex';
    }

    // NOVO: LÓGICA DE TELA CHEIA
    let activeFullscreenPhase = 1;

    function openFullscreenColors(phase) {
        activeFullscreenPhase = phase;
        document.getElementById('modal-fullscreen-colors').style.display = 'flex';
        renderFullscreenColors();
    }

    function closeFullscreenColors() {
        document.getElementById('modal-fullscreen-colors').style.display = 'none';
    }

    function renderFullscreenColors() {
        const grid = document.getElementById('grid-cores-fullscreen');
        grid.innerHTML = '';
        
        listaCores.forEach(cor => {
            const btn = document.createElement('div');
            btn.className = 'color-btn-fullscreen';
            btn.style.background = cor.hex;
            btn.onclick = () => {
                if (activeFullscreenPhase === 1) {
                    applyColor1(cor.hex, cor.grupo);
                } else {
                    applyColor2(cor.hex, cor.grupo);
                }
                closeFullscreenColors(); // Fecha automaticamente após escolher a cor!
            };
            grid.appendChild(btn);
        });
    }

    function renderizarCores(containerId, clickHandler) {
        const grid = document.getElementById(containerId);
        grid.innerHTML = '';
        
        listaCores.forEach(cor => {
            const btn = document.createElement('div');
            btn.className = 'color-btn';
            btn.style.background = cor.hex;
            btn.onclick = () => clickHandler(cor.hex, cor.grupo);
            grid.appendChild(btn);
        });
    }

    function initPanZoom(containerId, svgId) {
        const container = document.getElementById(containerId);
        const svg = document.getElementById(svgId);
        
        svg.dataset.scale = 1; svg.dataset.x = 0; svg.dataset.y = 0;
        let isDragging = false; 
        let startX, startY;
        let initMouseX, initMouseY; 

        svg.updateTransform = function() {
            this.style.transform = `translate(${this.dataset.x}px, ${this.dataset.y}px) scale(${this.dataset.scale})`;
        };

        container.addEventListener('pointerdown', e => {
            isDragging = true; 
            isPanningMap = false;
            
            startX = e.clientX - parseFloat(svg.dataset.x);
            startY = e.clientY - parseFloat(svg.dataset.y);
            
            initMouseX = e.clientX;
            initMouseY = e.clientY;
            
            container.style.cursor = 'grabbing';
        });

        window.addEventListener('pointerup', () => {
            isDragging = false;
            container.style.cursor = 'default';
            setTimeout(() => { isPanningMap = false; }, 50); 
        });

        container.addEventListener('pointermove', e => {
            if (!isDragging) return;
            
            if (Math.abs(e.clientX - initMouseX) > 4 || Math.abs(e.clientY - initMouseY) > 4) {
                isPanningMap = true;
            }
            
            svg.dataset.x = e.clientX - startX;
            svg.dataset.y = e.clientY - startY;
            svg.updateTransform();
        });

        container.addEventListener('wheel', e => {
            e.preventDefault();
            let scale = parseFloat(svg.dataset.scale);
            scale += e.deltaY * -0.0015;
            scale = Math.min(Math.max(0.5, scale), 4);
            svg.dataset.scale = scale;
            svg.updateTransform();
        });
    }

    function zoomControl(svgId, action) {
        const svg = document.getElementById(svgId);
        let scale = parseFloat(svg.dataset.scale);
        
        if (action === 'in') scale = Math.min(scale + 0.3, 4);
        if (action === 'out') scale = Math.max(scale - 0.3, 0.5);
        if (action === 'reset') { scale = 1; svg.dataset.x = 0; svg.dataset.y = 0; }
        
        svg.dataset.scale = scale;
        svg.updateTransform();
    }

    // --- LÓGICA ETAPA 1 ---
    function startGame() {
        document.getElementById('modal-intro-1').style.display = 'none';
        renderizarCores('grid-cores-1', applyColor1);
        setupMandala1();
        initPanZoom('canvas-mold-1', 'mandala-svg-1'); 

        // INICIA O TUTORIAL DEPOIS QUE TUDO CARREGAR
        startTutorial();
    }

    function setupMandala1() {
        document.querySelectorAll('.mandala-part').forEach(part => {
            part.onclick = (e) => {
                if(isPanningMap) return;
                if(mandala1Finished) return;
                if(selectedPart) selectedPart.classList.remove('selected');
                selectedPart = part;
                part.classList.add('selected');
                document.getElementById('msg-box').innerText = "Escolha variações de cor da mesma família que você começou.";
            };
        });
    }

    function applyColor1(hex, grupo) {
        if(!selectedPart || mandala1Finished) return;
        selectedPart.style.fill = hex;
        paintedParts1.set(selectedPart.id, grupo);
        checkCompletion1();
    }

    function checkCompletion1() {
        const total = document.querySelectorAll('.mandala-part').length;
        document.getElementById('btn-send-1').disabled = paintedParts1.size !== total;
    }

    function validateMandala1() {
        const grupos = Array.from(paintedParts1.values());
        
        const contagem = {};
        let grupoBase = grupos[0];
        let maxCount = 0;
        
        grupos.forEach(g => {
            contagem[g] = (contagem[g] || 0) + 1;
            if(contagem[g] > maxCount) {
                maxCount = contagem[g];
                grupoBase = g; 
            }
        });

        const erros = [];
        paintedParts1.forEach((grupo, id) => { 
            if(grupo !== grupoBase) erros.push(document.getElementById(id)); 
        });

        if(erros.length === 0) {
            mandala1Finished = true;
            if(selectedPart) selectedPart.classList.remove('selected');
            document.querySelector('#phase1 #canvas-mold-1').classList.add('success-state');
            document.getElementById('modal-success-1').style.display = 'flex';
        } else {
            document.getElementById('msg-box').innerHTML = `<span style='color:var(--danger)'>QUASE!</span><br>Sua base parece ser <b>${grupoBase}</b>, mas você usou peças de outras famílias.`;
            erros.forEach(el => el.classList.add('error-blink'));
            setTimeout(() => {
                erros.forEach(el => {
                    el.classList.remove('error-blink');
                    el.style.fill = '';
                    paintedParts1.delete(el.id);
                });
                checkCompletion1();
            }, 1600);
        }
    }

    // --- LÓGICA ETAPA 2 ---
    function showIntroPhase2() {
        document.getElementById('modal-success-1').style.display = 'none';
        document.getElementById('phase1').style.display = 'none';
        document.getElementById('modal-intro-2').style.display = 'flex';
    }

    function startPhase2() {
        document.getElementById('modal-intro-2').style.display = 'none';
        document.getElementById('phase2').classList.add('active-phase');
        renderizarCores('grid-cores-2', applyColor2);
        setupMandala2();
        initPanZoom('canvas-mold-2', 'mandala-svg-2'); 
    }

    function setupMandala2() {
        document.querySelectorAll('.mandala-part-2').forEach(part => {
            part.onclick = () => {
                if(isPanningMap) return; 
                if(mandala2Finished) return;
                if(selectedPart) selectedPart.classList.remove('selected');
                selectedPart = part;
                part.classList.add('selected');
                document.getElementById('msg-box-2').innerText = "Crie contraste! Misture as cores.";
            };
        });
    }

    function applyColor2(hex, grupo) {
        if(!selectedPart || mandala2Finished) return;
        selectedPart.style.fill = hex;
        paintedParts2.set(selectedPart.id, grupo);
        
        const total = document.querySelectorAll('.mandala-part-2').length;
        document.getElementById('btn-send-2').disabled = paintedParts2.size !== total;
    }

    function validateMandala2() {
        const gruposUnicos = new Set(paintedParts2.values());
        if(gruposUnicos.size >= 3) {
            mandala2Finished = true;
            if(selectedPart) selectedPart.classList.remove('selected');
            document.querySelector('#phase2 #canvas-mold-2').classList.add('success-state');
            document.getElementById('modal-victory-final').style.display = 'flex';
        } else {
            document.getElementById('msg-box-2').innerHTML = "<span style='color:var(--danger)'>POUCA VARIEDADE!</span><br>Use pelo menos 3 famílias de cores diferentes.";
        }
    }

    function backToPhase1() {
        document.getElementById('phase2').classList.remove('active-phase');
        document.getElementById('phase1').style.display = 'flex';
        document.getElementById('phase1').classList.add('active-phase');
    }

    function resetPhase2() {
        paintedParts2.clear();
        document.querySelectorAll('.mandala-part-2').forEach(p => p.style.fill = '');
        document.getElementById('btn-send-2').disabled = true;
        document.querySelector('#phase2 #canvas-mold-2').classList.remove('success-state');
    }

    function resetPhase1() {
        paintedParts1.clear();
        mandala1Finished = false;
        
        if (selectedPart) {
            selectedPart.classList.remove('selected');
            selectedPart = null;
        }

        document.querySelectorAll('.mandala-part').forEach(p => {
            p.style.fill = '';
            p.classList.remove('selected', 'error-blink');
        });

        document.getElementById('btn-send-1').disabled = true;
        document.querySelector('#phase1 #canvas-mold-1').classList.remove('success-state');
        document.getElementById('msg-box').innerText = "Selecione uma parte da mandala. Escolha tons de UMA MESMA família de cores.";
        
        document.getElementById('modal-success-1').style.display = 'none';
    }

    function prosseguirParaMapa() {
    // Mostra uma tela preta rápida para o jogador ver que está a carregar
    document.body.innerHTML = "<h2 style='color:white; text-align:center; margin-top:20%; font-family:sans-serif;'>Viajando para a próxima dimensão de cores...</h2>";
    
    // Viaja diretamente para o ficheiro da Fase 4!
    window.location.href = "cores.html";
}

/* ============================================================
   LÓGICA DO TUTORIAL DAS MANDALAS (MULTI-ETAPA)
============================================================ */
let tutorialStep = 0;
let tutTypeInterval = null;

const isMobileDevice = window.innerWidth <= 768;
const actionWord = isMobileDevice ? "Toque" : "Clique"; 

function startTutorial() {
    document.getElementById('tutorial-overlay').style.display = 'block';
    tutorialStep = 1;
    setTimeout(runTutorialStep, 500); 
}

/* ============================================================
   SEQUÊNCIA COMPLETA E DIDÁTICA DO TUTORIAL
============================================================ */
function runTutorialStep() {
    const spotlight = document.getElementById('tutorial-spotlight');
    const dialogContainer = document.querySelector('.tutorial-dialogue-container');
    
    // --- MÁGICA DO MOBILE: MOVE A CAIXA PARA NÃO COBRIR O HOLOFOTE ---
    if (isMobileDevice && dialogContainer) {
        if (tutorialStep >= 2) {
            // Do passo 2 em diante (elementos na base), a caixa vai pro topo
            dialogContainer.classList.add('move-top');
        } else {
            // No passo 1 (Mandala no topo), a caixa fica na base
            dialogContainer.classList.remove('move-top');
        }
    }
    
    if (tutorialStep === 1) {
        // PASSO 1: A PÉTALA (AÇÃO INICIAL)
        const primeiraPetala = document.querySelector('.mandala-part');
        highlightElementRaw(primeiraPetala); 
        typeTutorialText(`Para começar sua obra, ${actionWord} em uma das partes da mandala, como esta área que destaquei.`);
    } 
    else if (tutorialStep === 2) {
        // PASSO 2: O OBJETIVO (ID: msg-box)
        highlightElement('msg-box');
        typeTutorialText(`Fique de olho aqui! Este é o seu objetivo: Para vencer esta fase, você deve usar apenas tons de uma mesma família de cores.`);
    }
    else if (tutorialStep === 3) {
        // PASSO 3: AS CORES (ID: grid-cores-1)
        highlightElement('grid-cores-1');
        typeTutorialText(`Aqui estão seus pigmentos. Escolha tons que pertençam à família que você definiu para manter a monocromia.`);
    }
    else if (tutorialStep === 4) {
        // PASSO 4: VERIFICAR (ID: btn-send-1)
        highlightElement('btn-send-1');
        typeTutorialText(`Terminou a pintura? Use este botão para que eu possa validar sua técnica e sua percepção das cores.`);
    }
    else if (tutorialStep === 5) {
        // PASSO 5: REINICIAR (.btn-reset)
        const btnReset = document.querySelector('.btn-reset');
        highlightElementRaw(btnReset);
        typeTutorialText(`A arte é feita de tentativas. Se precisar recomeçar sua inspiração do zero, utilize o botão de reiniciar.`);
    }
    else if (tutorialStep === 6) {
        // PASSO 6: TELA CHEIA (.btn-fullscreen)
        const btnFull = document.querySelector('.btn-fullscreen');
        highlightElementRaw(btnFull);
        typeTutorialText(`Por fim, se quiser apreciar sua criação sem distrações, o modo Tela Cheia é perfeito para você.`);
    }
    else {
        // FIM DO TUTORIAL
        if (dialogContainer) dialogContainer.classList.remove('move-top'); // Reseta a classe
        document.getElementById('tutorial-overlay').style.display = 'none';
    }
}

function nextTutorialStep() {
    tutorialStep++;
    runTutorialStep();
}

function highlightElement(elementId) {
    const target = document.getElementById(elementId);
    highlightElementRaw(target);
}

// Versão que aceita o elemento direto (útil para botões sem ID)
function highlightElementRaw(target) {
    const spotlight = document.getElementById('tutorial-spotlight');
    if (target && spotlight) {
        const rect = target.getBoundingClientRect(); 
        spotlight.style.top = (rect.top - 5) + 'px';
        spotlight.style.left = (rect.left - 5) + 'px';
        spotlight.style.width = (rect.width + 10) + 'px';
        spotlight.style.height = (rect.height + 10) + 'px';
    }
}

function typeTutorialText(textToType) {
    const textEl = document.getElementById('tutorial-text');
    if (!textEl) return;
    textEl.innerHTML = ""; 
    clearInterval(tutTypeInterval); 
    let i = 0;
    tutTypeInterval = setInterval(() => {
        textEl.innerHTML += textToType.charAt(i);
        i++;
        if (i >= textToType.length) clearInterval(tutTypeInterval);
    }, 30);
}


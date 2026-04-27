// Puxa o número que veio da URL
let unlockedLevel = parseInt(window.NIVEL_DESBLOQUEADO) || 1;
let selectedPhase = unlockedLevel > 4 ? 4 : unlockedLevel; 
let currentPhase = 1;
let mixedInPhase = new Set();
let draggedClone = null, originalEl = null, offsetX = 0, offsetY = 0;
let phaseCompleted = false;

// Se veio do link de outra fase, pula a tela inicial e vai direto pro mapa!
window.onload = () => {
    if (unlockedLevel > 1) {
        const mainMenu = document.getElementById('main-menu');
        const mapScreen = document.getElementById('map-screen');
        if (mainMenu) mainMenu.style.display = 'none';
        if (mapScreen) mapScreen.style.display = 'flex';
        updateMapUI();
    }
};

const wheelMap = { 
    'Azul': 0, 'Azul-esverdeado': 30, 'Verde': 60, 'Amarelo-esverdeado': 90, 
    'Amarelo': 120, 'Amarelo-alaranjado': 150, 'Laranja': 180, 
    'Vermelho-alaranjado': 210, 'Vermelho': 240, 'Vermelho-arroxeado': 270, 
    'Roxo': 300, 'Azul-arroxeado': 330 
};

const mixes = { 
    'vermelho+amarelo': { name: 'Laranja', hex: '#e67e22', psych: 'Energia!' },
    'amarelo+vermelho': { name: 'Laranja', hex: '#e67e22', psych: 'Energia!' },
    'azul+amarelo': { name: 'Verde', hex: '#27ae60', psych: 'Equilíbrio!' },
    'amarelo+azul': { name: 'Verde', hex: '#27ae60', psych: 'Equilíbrio!' },
    'azul+vermelho': { name: 'Roxo', hex: '#8e44ad', psych: 'Mistério!' },
    'vermelho+azul': { name: 'Roxo', hex: '#8e44ad', psych: 'Mistério!' },
    'vermelho+laranja': { name: 'Vermelho-alaranjado', hex: '#ff5722', psych: 'Vibrante!' },
    'laranja+vermelho': { name: 'Vermelho-alaranjado', hex: '#ff5722', psych: 'Vibrante!' },
    'amarelo+laranja': { name: 'Amarelo-alaranjado', hex: '#ffb300', psych: 'Otimismo!' },
    'laranja+amarelo': { name: 'Amarelo-alaranjado', hex: '#ffb300', psych: 'Otimismo!' },
    'amarelo+verde': { name: 'Amarelo-esverdeado', hex: '#9ccc65', psych: 'Frescor!' },
    'verde+amarelo': { name: 'Amarelo-esverdeado', hex: '#9ccc65', psych: 'Frescor!' },
    'azul+verde': { name: 'Azul-esverdeado', hex: '#008b8b', psych: 'Serenidade!' },
    'verde+azul': { name: 'Azul-esverdeado', hex: '#008b8b', psych: 'Serenidade!' },
    'azul+roxo': { name: 'Azul-arroxeado', hex: '#483d8b', psych: 'Profundidade!' },
    'roxo+azul': { name: 'Azul-arroxeado', hex: '#483d8b', psych: 'Profundidade!' },
    'vermelho+roxo': { name: 'Vermelho-arroxeado', hex: '#c71585', psych: 'Nobreza!' },
    'roxo+vermelho': { name: 'Vermelho-arroxeado', hex: '#c71585', psych: 'Nobreza!' }
};

function showMap() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('map-screen').style.display = 'flex';
    updateMapUI();
}

function selectPhase(level) {
    if (level <= unlockedLevel) { 
        selectedPhase = level; 
        updateMapUI(); 
    }
}

function updateMapUI() {
    const names = ["Primárias", "Secundárias", "Mono&Poli", "Quentes e Frias"]; 
    for (let i = 1; i <= 4; i++) { 
        const node = document.getElementById(`node-${i}`);
        if(node) {
            node.className = (i <= unlockedLevel) ? 'phase-node active' : 'phase-node locked';
            node.style.border = (i === selectedPhase) ? "3px solid #2c3e50" : "none";
        }
    }
    
    const phaseNameEl = document.getElementById('selected-phase-name');
    if (phaseNameEl) {
        phaseNameEl.innerText = `Fase ${selectedPhase}: ${names[selectedPhase-1]}`;
    }
}

function startGame() {
    if (selectedPhase === 3) {
        window.location.href = "mandalas.html"; 
        return; 
    }
    
    if (selectedPhase === 4) {
        window.location.href = "cores.html"; 
        return; 
    }

    document.getElementById('map-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    initPhase(selectedPhase);
}

function initPhase(phase) {
    currentPhase = phase;
    
    // CRÍTICO: Limpa os dados de vitórias anteriores para não bugar a progressão
    mixedInPhase.clear();
    phaseCompleted = false;

    const area = document.getElementById('color-area');
    if (area) area.innerHTML = '';
    
    // CRÍTICO: Limpa a roda cromática caso o jogador esteja reiniciando a fase
    const wheel = document.getElementById('chromatic-wheel');
    if (wheel) wheel.innerHTML = '';
    
    if (phase === 1) {
        showIntro("Fase 1", "Misture as cores para evoluir!");
        const tri = document.createElement('div'); tri.className = "phase1-triangle";
        area.appendChild(tri);
        const colors = [{id:'azul', hex:'#2e86de', lab:'AZUL'},{id:'vermelho', hex:'#ff4757', lab:'VERMELHO'},{id:'amarelo', hex:'#ffff00', lab:'AMARELO'}];
        colors.forEach(c => { 
            createBall(c.id, c.hex, c.lab, tri); 
            addSlice(c.lab.charAt(0)+c.lab.slice(1).toLowerCase(), c.hex);
        });
    } else if (phase === 2) {
        showIntro("Fase 2", "Crie as cores secundárias!");
        const cols = document.createElement('div'); cols.className = "phase2-columns";
        area.appendChild(cols);
        const colors = [{id:'azul', hex:'#2e86de', lab:'AZUL'},{id:'vermelho', hex:'#ff4757', lab:'VERMELHO'},{id:'amarelo', hex:'#ffff00', lab:'AMARELO'},{id:'roxo', hex:'#8e44ad', lab:'ROXO'},{id:'verde', hex:'#27ae60', lab:'VERDE'},{id:'laranja', hex:'#e67e22', lab:'LARANJA'}];
        colors.forEach(c => { 
            createBall(c.id, c.hex, c.lab, cols); 
            addSlice(c.id.charAt(0).toUpperCase()+c.id.slice(1), c.hex); 
        });
    } else if (phase === 3) {
        // Fallback apenas de segurança (geralmente ignorado pelo redirecionamento no startGame)
        showIntro("Fase 3", "Nível Mestre: Complete o círculo cromático de 12 cores!");
        const cols = document.createElement('div'); cols.className = "phase2-columns"; 
        area.appendChild(cols);
        const colors = [
            {id:'azul', hex:'#2e86de', lab:'AZUL'}, {id:'vermelho', hex:'#ff4757', lab:'VERM.'}, {id:'amarelo', hex:'#ffff00', lab:'AMAR.'},
            {id:'roxo', hex:'#8e44ad', lab:'ROXO'}, {id:'verde', hex:'#27ae60', lab:'VERDE'}, {id:'laranja', hex:'#e67e22', lab:'LARANJA'}
        ];
        colors.forEach(c => { 
            createBall(c.id, c.hex, c.lab, cols); 
            addSlice(c.id.charAt(0).toUpperCase()+c.id.slice(1), c.hex); 
        });
    }
}

function createBall(id, color, label, parent) {
    const b = document.createElement('div');
    b.id = id; b.className = 'color-ball'; b.style.background = color; b.innerText = label;
    if(id === 'amarelo') b.style.color = '#333';
    b.onpointerdown = handleDown;
    parent.appendChild(b);
}

function handleDown(e) {
    // Evita arrastar duplicatas caso o jogador clique muito rápido com múltiplos dedos
    if (draggedClone) return;

    originalEl = e.target;
    
    try {
        originalEl.setPointerCapture(e.pointerId);
    } catch(err) {} // Previne crashes caso o ID do pointer se perca rápido demais

    const r = originalEl.getBoundingClientRect();
    draggedClone = originalEl.cloneNode(true);
    offsetX = e.clientX - r.left; offsetY = e.clientY - r.top;
    
    // Z-index extremo e margem limpa para garantir que fique por cima de tudo
    Object.assign(draggedClone.style, { 
        position:'fixed', left:r.left+'px', top:r.top+'px', 
        width:r.width+'px', height:r.height+'px', 
        zIndex:9999, pointerEvents:'none', opacity:'0.8', margin:'0' 
    });
    
    document.body.appendChild(draggedClone);
    originalEl.style.visibility = 'hidden';
    
    document.onpointermove = (ev) => {
        if (!draggedClone) return;
        draggedClone.style.left = (ev.clientX - offsetX) + 'px';
        draggedClone.style.top = (ev.clientY - offsetY) + 'px';
    };
    
    document.onpointerup = (ev) => {
        try { originalEl.releasePointerCapture(ev.pointerId); } catch(err){}

        const targetElement = document.elementFromPoint(ev.clientX, ev.clientY);
        
        // Usa '.closest' para garantir que pegamos a bolinha inteira e não a tag do texto
        const targetBall = targetElement ? targetElement.closest('.color-ball') : null;

        if (targetBall && targetBall !== originalEl) {
            const res = mixes[`${originalEl.id}+${targetBall.id}`];
            if (res) {
                showResult(res);
            } else { 
                const errorOverlay = document.getElementById('error-overlay');
                if(errorOverlay) errorOverlay.style.display = 'flex'; 
            }
        }
        
        if (draggedClone) {
            draggedClone.remove(); 
            draggedClone = null;
        }
        if (originalEl) {
            originalEl.style.visibility = 'visible';
            originalEl = null;
        }
        
        document.onpointermove = null; 
        document.onpointerup = null;
    };
}

function showResult(result) {
    document.getElementById('final-color-display').style.background = result.hex;
    document.getElementById('final-color-name').innerText = result.name;
    document.getElementById('color-psychology').innerText = result.psych;
    
    if (!mixedInPhase.has(result.name)) {
        mixedInPhase.add(result.name);
        addSlice(result.name, result.hex);
        checkWin();
    }

    document.getElementById('result-overlay').style.display = 'flex';
}

function checkWin() {
    let goal = 3; 
    if (currentPhase === 2) goal = 6;  
    if (currentPhase === 3) goal = 12; 
    
    if (mixedInPhase.size >= goal) {
        phaseCompleted = true;
    }
}

function addSlice(name, hex) {
    const angle = wheelMap[name];
    if (angle === undefined) return;
    const slice = document.createElement('div');
    slice.className = 'wheel-slice';
    slice.style.background = hex;
    slice.style.transform = `rotate(${angle}deg)`;
    const wheel = document.getElementById('chromatic-wheel');
    if(wheel) wheel.appendChild(slice);
}

function closeError() { 
    const err = document.getElementById('error-overlay');
    if(err) err.style.display = 'none'; 
}

function resetAfterMix() { 
    const overlay = document.getElementById('result-overlay');
    if(overlay) overlay.style.display = 'none'; 
    
    if (phaseCompleted) {
        if (currentPhase === 1) {
            // FASE 1: Espera 2 segundos mostrando o círculo incompleto e vai direto pro Mapa!
            setTimeout(() => {
                finishPhase();
            }, 2000);
        } else {
            // FASE 2 e 3: Espera 2 segundos mostrando o jogo e DEPOIS mostra o card de Vitória!
            setTimeout(() => {
                const vic = document.getElementById('victory-overlay');
                if(vic) vic.style.display = 'flex';
            }, 2000);
        }
    }
}

function showIntro(t, d) { 
    document.getElementById('phase-title').innerText = t; 
    document.getElementById('phase-desc').innerText = d; 
    const intro = document.getElementById('phase-intro');
    if(intro) intro.style.display = 'flex'; 
}

function closeIntro() { 
    const intro = document.getElementById('phase-intro');
    if(intro) intro.style.display = 'none'; 
}

function finishPhase() {
    if (phaseCompleted) {
        unlockedLevel = Math.max(unlockedLevel, currentPhase + 1);
        selectedPhase = Math.min(unlockedLevel, 4); 
        
        // SALVA O PROGRESSO NA MEMÓRIA
        localStorage.setItem('progressoColorFusion', unlockedLevel.toString());
    }
    const vic = document.getElementById('victory-overlay');
    if(vic) vic.style.display = 'none';
    
    const game = document.getElementById('game-screen');
    if(game) game.style.display = 'none';
    
    showMap();
}
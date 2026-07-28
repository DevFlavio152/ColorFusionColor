// Puxa o progresso do localStorage
let savedLevel = localStorage.getItem('progressoColorFusion');
let unlockedLevel = savedLevel ? parseInt(savedLevel) : 1;
let selectedPhase = unlockedLevel > 5 ? 5 : unlockedLevel; 
let currentPhase = 1;
let mixedInPhase = new Set();
let draggedClone = null, originalEl = null, offsetX = 0, offsetY = 0;
let phaseCompleted = false;

window.onload = () => {
    // 1. DETECTA SE A PÁGINA FOI ATUALIZADA (F5 / RELOAD)
    const perfEntries = performance.getEntriesByType("navigation");
    const isReload = (perfEntries.length > 0 && perfEntries[0].type === "reload") || 
                     (performance.navigation && performance.navigation.type === 1);

    if (isReload) {
        // Se deu F5, apaga todo o progresso e limpa a sessão
        localStorage.removeItem('progressoColorFusion');
        sessionStorage.clear();
        unlockedLevel = 1;
        selectedPhase = 1;
    } else {
        // Se NÃO foi F5, carrega o progresso salvo normalmente
        savedLevel = localStorage.getItem('progressoColorFusion');
        unlockedLevel = savedLevel ? parseInt(savedLevel) : 1;
        selectedPhase = unlockedLevel > 5 ? 5 : unlockedLevel;
    }

    // 2. VERIFICA SE O JOGADOR ESTÁ VOLTANDO DE UMA FASE
    const urlParams = new URLSearchParams(window.location.search);
    const veioDeFase = urlParams.get('map') === 'true' || sessionStorage.getItem('voltarParaOMapa') === 'true';

    if (!isReload && veioDeFase) {
        showMap(); // Vai para o mapa se estiver navegando entre fases
    } else {
        // Se foi F5 ou primeira abertura, volta para a TELA INICIAL
        document.getElementById('main-menu').style.display = 'flex';
        document.getElementById('map-screen').style.display = 'none';
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
    sessionStorage.setItem('voltarParaOMapa', 'true');

    savedLevel = localStorage.getItem('progressoColorFusion');
    unlockedLevel = savedLevel ? parseInt(savedLevel) : 1;
    selectedPhase = unlockedLevel > 5 ? 5 : unlockedLevel;

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
    const names = ["Introdução", "Secundárias", "Terciárias", "Mono&Poli", "Quentes e Frias"]; 
    
    // Atualiza o estado visual dos Nós (bolinhas) e Linhas
    for (let i = 1; i <= 5; i++) { 
        const node = document.getElementById(`node-${i}`);
        if (node) {
            if (i < unlockedLevel) {
                node.className = 'phase-node completed'; // Concluída
            } else if (i === unlockedLevel) {
                node.className = 'phase-node active';    // Fase atual liberada
            } else {
                node.className = 'phase-node locked';    // Bloqueada
            }
            node.style.border = (i === selectedPhase) ? "3px solid #2c3e50" : "none";
        }

        // Atualiza a linha de conexão com a próxima fase (ex: linha 1-2, 2-3, etc.)
        const line = document.getElementById(`line-${i}`) || document.getElementById(`linha-fase${i}`);
        if (line) {
            if (i < unlockedLevel) {
                line.classList.add('linha-amarela');
                line.classList.remove('linha-desativada');
            } else {
                line.classList.remove('linha-amarela');
                line.classList.add('linha-desativada');
            }
        }
    }
    
    const phaseNameEl = document.getElementById('selected-phase-name');
    if (phaseNameEl) {
        phaseNameEl.innerText = `Fase ${selectedPhase}: ${names[selectedPhase-1]}`;
    }
}

function startGame() {
    if (selectedPhase === 1) {
        window.location.href = "faseum.html"; 
        return; 
    }
    if (selectedPhase === 4) {
        window.location.href = "mandalas.html"; 
        return; 
    }
    if (selectedPhase === 5) {
        window.location.href = "cores.html"; 
        return; 
    }

    document.getElementById('map-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    initPhase(selectedPhase);
}

function initPhase(phase) {
    currentPhase = phase;
    mixedInPhase.clear();
    phaseCompleted = false;

    const area = document.getElementById('color-area');
    if (area) area.innerHTML = '';
    
    const wheel = document.getElementById('chromatic-wheel');
    if (wheel) wheel.innerHTML = '';
    
    if (phase === 2) {
        showIntro(2); 
        const tri = document.createElement('div'); tri.className = "phase1-triangle";
        area.appendChild(tri);
        const colors = [{id:'azul', hex:'#2e86de', lab:'AZUL'},{id:'vermelho', hex:'#ff4757', lab:'VERMELHO'},{id:'amarelo', hex:'#ffff00', lab:'AMARELO'}];
        colors.forEach(c => { 
            createBall(c.id, c.hex, c.lab, tri); 
            addSlice(c.lab.charAt(0)+c.lab.slice(1).toLowerCase(), c.hex);
        });
    } 
    else if (phase === 3) {
        showIntro(3); 
        const cols = document.createElement('div'); cols.className = "phase2-columns";
        area.appendChild(cols);
        const colors = [{id:'azul', hex:'#2e86de', lab:'AZUL'},{id:'vermelho', hex:'#ff4757', lab:'VERMELHO'},{id:'amarelo', hex:'#ffff00', lab:'AMARELO'},{id:'roxo', hex:'#8e44ad', lab:'ROXO'},{id:'verde', hex:'#27ae60', lab:'VERDE'},{id:'laranja', hex:'#e67e22', lab:'LARANJA'}];
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
    if (draggedClone) return;

    originalEl = e.target;
    
    try {
        originalEl.setPointerCapture(e.pointerId);
    } catch(err) {} 

    const r = originalEl.getBoundingClientRect();
    draggedClone = originalEl.cloneNode(true);
    offsetX = e.clientX - r.left; offsetY = e.clientY - r.top;
    
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
    if (currentPhase === 2) goal = 3;  
    if (currentPhase === 3) goal = 6; 
    
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
        if (currentPhase === 2) { 
            setTimeout(() => {
                finishPhase();
            }, 2000);
        } else {
            setTimeout(() => {
                const vic = document.getElementById('victory-overlay');
                if(vic) vic.style.display = 'flex';
            }, 2000);
        }
    }
}

let typeInterval = null; 

function showIntro(phaseNumber) { 
    const intro = document.getElementById('phase-intro');
    const textEl = document.getElementById('dialogue-text');
    const titleEl = document.getElementById('dialogue-title');
    const imgEl = document.getElementById('dialogue-img'); 

    let characterName = "Mestre das Cores";
    let textToType = "";

    if (phaseNumber === 2) {
        if (imgEl) imgEl.src = "Assets/personagem.png";
        textToType = "Saudações, aprendiz! Cientificamente, as cores primárias são pigmentos puros que não podem ser criados por mistura. Elas são a base de tudo. Misture-as para começarmos nossa jornada!";
    } 
    else if (phaseNumber === 3) {
        if (imgEl) imgEl.src = "Assets/personagememposiçao.png"; 
        textToType = "Excelente! O milagre da mistura de pigmentos... Quando duas Cores Primárias colidem, a magia acontece e nascem as Cores Secundárias. Seja um alquimista e descubra essas novas tonalidades!";
    }

    if (intro) intro.style.display = 'flex'; 
    if (titleEl) titleEl.innerText = characterName;
    
    if (textEl) {
        textEl.innerHTML = ""; 
        clearInterval(typeInterval); 
        
        let i = 0;
        typeInterval = setInterval(() => {
            textEl.innerHTML += textToType.charAt(i);
            i++;
            if (i >= textToType.length) {
                clearInterval(typeInterval); 
            }
        }, 40); 
    }
}

function closeIntro() { 
    clearInterval(typeInterval);
    const intro = document.getElementById('phase-intro');
    if(intro) intro.style.display = 'none'; 
}

function finishPhase() {
    if (phaseCompleted) {
        unlockedLevel = Math.max(unlockedLevel, currentPhase + 1);
        selectedPhase = Math.min(unlockedLevel, 5); 
        
        localStorage.setItem('progressoColorFusion', unlockedLevel.toString());
    }
    const vic = document.getElementById('victory-overlay');
    if(vic) vic.style.display = 'none';
    
    const game = document.getElementById('game-screen');
    if(game) game.style.display = 'none'; 
    
    showMap();
}


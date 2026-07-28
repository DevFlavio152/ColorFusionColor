// =======================================================
// 🛠️ PAINEL DE DEBUG UNIVERSAL 🛠️
// =======================================================
function criarPainelDebug() {
    // Se o painel já existir, não duplica
    if (document.getElementById('painel-cheat')) return;

    const painel = document.createElement('div');
    painel.id = 'painel-cheat';
    painel.style.position = 'fixed';
    painel.style.bottom = '10px';
    painel.style.right = '10px';
    painel.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    painel.style.color = 'white';
    painel.style.padding = '10px';
    painel.style.borderRadius = '8px';
    painel.style.zIndex = '999999'; 
    painel.style.display = 'flex';
    painel.style.flexDirection = 'column';
    painel.style.gap = '8px';
    painel.style.fontFamily = 'Arial, sans-serif';
    painel.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';

    const titulo = document.createElement('strong');
    titulo.innerText = '🛠️ Painel Cheat';
    titulo.style.textAlign = 'center';
    titulo.style.fontSize = '14px';
    titulo.style.marginBottom = '5px';
    painel.appendChild(titulo);

    // ==========================================
    // 1. BOTÕES DAS FASES DO MAPA (1 a 4)
    // ==========================================
    for (let i = 1; i <= 4; i++) {
        const btn = document.createElement('button');
        btn.innerText = `Liberar Fase ${i}`;
        btn.style.cursor = 'pointer';
        btn.style.padding = '5px 10px';
        btn.style.backgroundColor = '#2ecc71'; // Verde
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.fontWeight = 'bold';
        
        btn.onclick = () => {
            localStorage.setItem('progressoColorFusion', i.toString());
            sessionStorage.setItem('voltarParaOMapa', 'true'); 
            sessionStorage.setItem('usandoCheat', 'true'); 
            window.location.href = 'index.html?map=true'; 
        };
        painel.appendChild(btn);
    }

    // --- LINHA DIVISÓRIA ---
    const divisor = document.createElement('div');
    divisor.style.height = '1px';
    divisor.style.backgroundColor = '#555';
    divisor.style.margin = '2px 0';
    painel.appendChild(divisor);

    // ==========================================
    // 2. BOTÕES DIRETOS PARA FASES SOLTAS
    // ==========================================
    // Adicione aqui o nome e o arquivo HTML de qualquer tela extra
    const fasesExtras = [
        { nome: 'Ir para Quiz', url: 'quiz.html' },
        { nome: 'Ir para Cores', url: 'cores.html' }
    ];

    fasesExtras.forEach(fase => {
        const btnExtra = document.createElement('button');
        btnExtra.innerText = fase.nome;
        btnExtra.style.cursor = 'pointer';
        btnExtra.style.padding = '5px 10px';
        btnExtra.style.backgroundColor = '#e74c3c'; // Vermelho (Para diferenciar)
        btnExtra.style.color = '#fff';
        btnExtra.style.border = 'none';
        btnExtra.style.borderRadius = '4px';
        btnExtra.style.fontWeight = 'bold';
        
        // Simplesmente abre a página, sem passar pelo Mapa
        btnExtra.onclick = () => {
            window.location.href = fase.url; 
        };
        painel.appendChild(btnExtra);
    });

    document.body.appendChild(painel);
}

// 🛑 PARA DESATIVAR O PAINEL EM TODAS AS FASES DE UMA VEZ:
// Basta colocar // antes da função abaixo. Exemplo: // criarPainelDebug();
criarPainelDebug();
// =======================================================
// 🛠️ PAINEL DE DEBUG UNIVERSAL (COM AUTO-COMPLETAR MANDALAS)
// =======================================================
function criarPainelDebug() {
    // Se o painel já existir, não duplica
    if (document.getElementById('painel-cheat')) return;

    const painel = document.createElement('div');
    painel.id = 'painel-cheat';
    painel.style.position = 'fixed';
    painel.style.bottom = '10px';
    painel.style.right = '10px';
    painel.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    painel.style.color = 'white';
    painel.style.padding = '12px';
    painel.style.borderRadius = '10px';
    painel.style.zIndex = '999999'; 
    painel.style.display = 'flex';
    painel.style.flexDirection = 'column';
    painel.style.gap = '8px';
    painel.style.fontFamily = 'Arial, sans-serif';
    painel.style.boxShadow = '0 6px 15px rgba(0,0,0,0.6)';
    painel.style.maxHeight = '90vh';
    painel.style.overflowY = 'auto';

    const titulo = document.createElement('strong');
    titulo.innerText = '🛠️ Painel Cheat';
    titulo.style.textAlign = 'center';
    titulo.style.fontSize = '14px';
    titulo.style.marginBottom = '2px';
    painel.appendChild(titulo);

    // ==========================================
    // ⚡ CHEATS ESPECÍFICOS DA TELA DE MANDALAS
    // ==========================================
    // Verifica se as funções das mandalas existem no escopo global
    if (typeof validateMandala1 === 'function') {
        
        // Botão para passar a Etapa 1
        const btnPassarEtapa1 = document.createElement('button');
        btnPassarEtapa1.innerText = '⚡ Completar Etapa 1';
        btnPassarEtapa1.style.cursor = 'pointer';
        btnPassarEtapa1.style.padding = '6px 10px';
        btnPassarEtapa1.style.backgroundColor = '#9b59b6'; // Roxo
        btnPassarEtapa1.style.color = '#fff';
        btnPassarEtapa1.style.border = 'none';
        btnPassarEtapa1.style.borderRadius = '4px';
        btnPassarEtapa1.style.fontWeight = 'bold';

        btnPassarEtapa1.onclick = () => {
            const petalas = document.querySelectorAll('.mandala-part');
            if (petalas.length === 0) return;

            // Pinta todas as pétalas com a família VIOLET (válido para a regra da Etapa 1)
            petalas.forEach(petala => {
                petala.style.fill = '#4a148c'; 
                paintedParts1.set(petala.id, 'VIOLET');
            });

            // Atualiza o estado da tela e valida a vitória automaticamente
            checkCompletion1();
            validateMandala1();
        };
        painel.appendChild(btnPassarEtapa1);

        // Botão para passar a Etapa 2
        const btnPassarEtapa2 = document.createElement('button');
        btnPassarEtapa2.innerText = '⚡ Completar Etapa 2';
        btnPassarEtapa2.style.cursor = 'pointer';
        btnPassarEtapa2.style.padding = '6px 10px';
        btnPassarEtapa2.style.backgroundColor = '#8e44ad';
        btnPassarEtapa2.style.color = '#fff';
        btnPassarEtapa2.style.border = 'none';
        btnPassarEtapa2.style.borderRadius = '4px';
        btnPassarEtapa2.style.fontWeight = 'bold';

        btnPassarEtapa2.onclick = () => {
            const petalas2 = document.querySelectorAll('.mandala-part-2');
            if (petalas2.length === 0) return;

            const coresDiversas = [
                { hex: '#4a148c', grupo: 'VIOLET' },
                { hex: '#1b5e20', grupo: 'GREEN' },
                { hex: '#b71c1c', grupo: 'RED' }
            ];

            // Pinta usando 3 famílias diferentes (válido para a regra da Etapa 2)
            petalas2.forEach((petala, index) => {
                const cor = coresDiversas[index % 3];
                petala.style.fill = cor.hex;
                paintedParts2.set(petala.id, cor.grupo);
            });

            // Libera o botão e valida a vitória final
            document.getElementById('btn-send-2').disabled = false;
            validateMandala2();
        };
        painel.appendChild(btnPassarEtapa2);

        // Linha divisória para os cheats gerais
        const divMandala = document.createElement('div');
        divMandala.style.height = '1px';
        divMandala.style.backgroundColor = '#555';
        divMandala.style.margin = '2px 0';
        painel.appendChild(divMandala);
    }

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
            sessionStorage.setItem('progressoColorFusion', i.toString());
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
    const fasesExtras = [
        { nome: 'Ir para Quiz', url: 'quiz.html' },
        { nome: 'Ir para Cores', url: 'cores.html' }
    ];

    fasesExtras.forEach(fase => {
        const btnExtra = document.createElement('button');
        btnExtra.innerText = fase.nome;
        btnExtra.style.cursor = 'pointer';
        btnExtra.style.padding = '5px 10px';
        btnExtra.style.backgroundColor = '#e74c3c'; // Vermelho
        btnExtra.style.color = '#fff';
        btnExtra.style.border = 'none';
        btnExtra.style.borderRadius = '4px';
        btnExtra.style.fontWeight = 'bold';
        
        btnExtra.onclick = () => {
            window.location.href = fase.url; 
        };
        painel.appendChild(btnExtra);
    });

    document.body.appendChild(painel);
}

// Inicializa o painel
criarPainelDebug();
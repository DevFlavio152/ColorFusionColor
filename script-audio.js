/* ============================================================
   SISTEMA CENTRAL DE ÁUDIO DO JOGO (AUDIO MANAGER)
   ============================================================ */

const AudioManager = {
    bgmActual: null,
    bgmVolume: 0.35,  // Volume da música (35%)
    sfxVolume: 0.7,   // Volume dos efeitos sonoros (70%)
    audioDesbloqueado: false,

    // Mapeamento das Músicas de Fundo (BGM)
    bgmMap: {
        'index.html': 'Audio/bgm-mapa.mp3',
        'mapa.html': 'Audio/bgm-mapa.mp3',
        'faseum.html': 'Audio/bgm-memoria.mp3',
        'fase1.html': 'Audio/bgm-memoria.mp3',
        'fasedois.html': 'Audio/bgm-mistura.mp3',
        'fasetres.html': 'Audio/bgm-mistura.mp3',
        'mistura.html': 'Audio/bgm-mistura.mp3',
        'mandalas.html': 'Audio/bgm-mandalas.mp3',
        'cores.html': 'Audio/bgm-quentes-frias.mp3',
        'quentes-frias.html': 'Audio/bgm-quentes-frias.mp3',
        'quiz.html': 'Audio/bgm-quiz.mp3'
    },

    // Mapeamento dos Efeitos Sonoros (SFX)
    sfxMap: {
        'click': 'Audio/sfx-click.wav',
        'carta': 'Audio/sfx-carta.mp3',
        'acerto': 'Audio/sfx-acerto.mp3',
        'erro': 'Audio/sfx-erro.wav',
        'vitoria': 'Audio/sfx-vitoria.wav',
        'pintar': 'Audio/sfx-pintar.mp3',
        'creditos': 'Audio/bgm-creditos.mp3'
    },

    init() {
        const pathAtual = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
        const musicaParaPagina = this.bgmMap[pathAtual] || 'Audio/bgm-mapa.mp3';

        this.bgmActual = new Audio(musicaParaPagina);
        this.bgmActual.loop = true;
        this.bgmActual.volume = this.bgmVolume;

        const desativarBloqueio = () => {
            if (!this.audioDesbloqueado) {
                this.bgmActual.play().catch(() => {});
                this.audioDesbloqueado = true;
            }
        };

        window.addEventListener('click', desativarBloqueio, { once: true });
        window.addEventListener('keydown', desativarBloqueio, { once: true });

        document.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.closest('.btn-primary') || e.target.closest('.card')) {
                if (!e.target.closest('.card')) {
                    this.playSFX('click');
                }
            }
        });
    },

    // 🛑 Para a música de fundo atual completamente
    pararBGM() {
        if (this.bgmActual) {
            this.bgmActual.pause();
            this.bgmActual.currentTime = 0;
        }
    },

    // 🔄 Para a BGM atual e inicia a nova sem sobreposição
    trocarBGM(caminhoAudio) {
        this.pararBGM();
        this.bgmActual = new Audio(caminhoAudio);
        this.bgmActual.loop = true;
        this.bgmActual.volume = this.bgmVolume;
        this.bgmActual.play().catch(err => console.log('Aguardando interação para áudio:', err));
    },

    // Função para tocar qualquer efeito sonoro
    playSFX(nomeSom) {
        const caminhoSom = this.sfxMap[nomeSom];
        if (!caminhoSom) return;

        const sfx = new Audio(caminhoSom);
        sfx.volume = this.sfxVolume;
        sfx.play().catch(err => console.log('Aguardando interação para áudio:', err));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AudioManager.init();
});

// --- ATALHOS GLOBAIS ---
function tocarSom(nomeSom) {
    AudioManager.playSFX(nomeSom);
}

function pararBGM() {
    AudioManager.pararBGM();
}

function trocarBGM(caminhoAudio) {
    AudioManager.trocarBGM(caminhoAudio);
}
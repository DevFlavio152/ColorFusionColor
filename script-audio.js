/* ============================================================
   SISTEMA CENTRAL DE ÁUDIO DO JOGO (AUDIO MANAGER)
   ============================================================ */

const AudioManager = {
    bgmActual: null,
    bgmVolume: 0.35,  // Volume da música (35% para não abafar o jogo)
    sfxVolume: 0.7,   // Volume dos efeitos sonoros (70%)
    audioDesbloqueado: false,

    // Mapeamento exato das Músicas de Fundo (BGM) para cada página HTML
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

    // Mapeamento exato dos Efeitos Sonoros (SFX) da sua pasta
    sfxMap: {
        'click': 'Audio/sfx-click.wav',
        'carta': 'Audio/sfx-carta.mp3',
        'acerto': 'Audio/sfx-acerto.mp3',
        'erro': 'Audio/sfx-erro.wav',
        'vitoria': 'Audio/sfx-vitoria.wav',
        'pintar': 'Audio/sfx-pintar.mp3',
        'creditos': 'Audio/bgm-creditos.mp3' // 👈 ADICIONE ESTA LINHA
    },

    // Inicia a música de acordo com a página atual
    init() {
        const pathAtual = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
        const musicaParaPagina = this.bgmMap[pathAtual] || 'Audio/bgm-mapa.mp3';

        this.bgmActual = new Audio(musicaParaPagina);
        this.bgmActual.loop = true;
        this.bgmActual.volume = this.bgmVolume;

        // Tentar tocar quando o usuário interagir pela 1ª vez (Regra de Autoplay dos Navegadores)
        const desativarBloqueio = () => {
            if (!this.audioDesbloqueado) {
                this.bgmActual.play().catch(() => {});
                this.audioDesbloqueado = true;
            }
        };

        window.addEventListener('click', desativarBloqueio, { once: true });
        window.addEventListener('keydown', desativarBloqueio, { once: true });

        // Toca automaticamente cliques em botões genéricos
        document.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.closest('.btn-primary') || e.target.closest('.card')) {
                // Se for carta, a fase pode chamar 'carta' manualmente
                if (!e.target.closest('.card')) {
                    this.playSFX('click');
                }
            }
        });
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

// Inicializa automaticamente quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    AudioManager.init();
});

// Atalho global facilitado para usar nas fases
function tocarSom(nomeSom) {
    AudioManager.playSFX(nomeSom);
}
let usuarioLogado = null;
let jogoAtual = null;

async function fazerLogin() {
    const nome = document.getElementById('username-input').value.trim();
    if (!nome) return alert('Digite um nome válido!');

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome })
    });

    usuarioLogado = await res.json();
    
    document.getElementById('welcome-msg').innerText = `Jogador: ${usuarioLogado.nome}`;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
}

function carregarJogo(id_jogo) {
    jogoAtual = id_jogo;
    const container = document.getElementById('iframe-container');
    // Carrega o jogo dentro do iframe
    container.innerHTML = `<iframe src="games/${id_jogo}/index.html" id="game-frame"></iframe>`;
    atualizarRanking();
}

async function atualizarRanking() {
    if (!jogoAtual) return;
    const res = await fetch(`/api/ranking/${jogoAtual}`);
    const dados = await res.json();
    
    const lista = document.getElementById('ranking-list');
    lista.innerHTML = dados.length === 0 ? '<li>Nenhum recorde ainda!</li>' : '';
    
    dados.forEach(p => {
        lista.innerHTML += `<li><strong>${p.nome}</strong> - ${p.valor} pts (${p.data})</li>`;
    });
}

// ESCUTAR O FIM DO JOGO VINDO DO IFRAME
window.addEventListener('message', async (event) => {
    // Garante que o evento tem os dados de pontuação esperados
    if (event.data && event.data.type === 'GAME_OVER') {
        const { score } = event.data;
        
        // Envia para o Back-end salvar
        await fetch('/api/pontuacao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_usuario: usuarioLogado.id,
                nome: usuarioLogado.nome,
                id_jogo: jogoAtual,
                valor: score
            })
        });

        alert(`Fim de jogo! Sua pontuação de ${score} pontos foi salva.`);
        atualizarRanking(); // Atualiza a lista na tela lateral
    }
});

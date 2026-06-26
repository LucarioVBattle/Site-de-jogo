const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Bancos de dados simulados em memória (reiniciam se o servidor parar)
let usuarios = [{ id: 1, nome: "Jogador1" }];
let pontuacoes = [
    { id_usuario: 1, nome: "Jogador1", id_jogo: "clicker", valor: 15, data: "26/06/2026" }
];

// Rota de Login Simplificada
app.post('/api/login', (req, res) => {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });
    
    let usuario = usuarios.find(u => u.nome.toLowerCase() === nome.toLowerCase());
    if (!usuario) {
        usuario = { id: usuarios.length + 1, nome };
        usuarios.push(usuario);
    }
    res.json(usuario);
});

// Salvar Pontuação
app.post('/api/pontuacao', (req, res) => {
    const { id_usuario, nome, id_jogo, valor } = req.body;
    if (!id_usuario || !id_jogo || valor === undefined) {
        return res.status(400).json({ error: "Dados incompletos" });
    }

    const novaPontuacao = {
        id_usuario,
        nome,
        id_jogo,
        valor: Number(valor),
        data: new Date().toLocaleDateString('pt-BR')
    };

    pontuacoes.push(novaPontuacao);
    res.json({ success: true, novaPontuacao });
});

// Buscar Ranking por Jogo
app.get('/api/ranking/:id_jogo', (req, res) => {
    const { id_jogo } = req.params;
    const rankingFiltrado = pontuacoes
        .filter(p => p.id_jogo === id_jogo)
        .sort((a, b) => b.valor - a.valor) // Maior pontuação primeiro
        .slice(0, 10); // Top 10

    res.json(rankingFiltrado);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

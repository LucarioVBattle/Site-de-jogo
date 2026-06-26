# 🎮 Game Hub - Plataforma de Mini-Jogos

Projeto integrador simulando um ecossistema centralizador de jogos simples, focado na prática de integração Front/Back, API REST e mensageria entre contextos com `postMessage`.

## 🛠️ Tecnologias
- **Front-end:** HTML5, CSS3, JavaScript (DOM e Web APIs)
- **Back-end:** Node.js, Express.js

## 🚀 Como Executar o Projeto

1. Certifique-se de ter o **Node.js** instalado na sua máquina.
2. Clone este repositório:
   ```bash
   git clone https://github.com
   ```
3. Acesse a pasta do projeto:
   ```bash
   cd game-hub
   ```
4. Instale as dependências necessárias:
   ```bash
   npm install
   ```
5. Inicie o servidor local:
   ```bash
   npm start
   ```
6. Abra o navegador e acesse:
   [http://localhost:3000](http://localhost:3000)

## 🕹️ Como funciona a integração
Os jogos integrados rodam dentro de um contexto isolado (`<iframe>`). Ao disparar o evento de fim de jogo, o script filho envia uma mensagem estruturada para a janela principal:
```javascript
window.parent.postMessage({ type: 'GAME_OVER', score: valor }, '*');
```
A plataforma captura essa pontuação através de um `EventListener` global, associa ao usuário logado e submete assincronamente ao endpoint `POST /api/pontuacao`.

<template>
  <div class="app">
    <header class="app-header">
      <h1>♔ Jeu d'Échecs ♚</h1>
      <p class="subtitle">Déplacez les pièces librement</p>
    </header>

    <main class="game-container">
      <ChessBoard @move="onMove" />
      <MoveHistory :moves="moveHistory" />
    </main>

    <footer class="app-footer">
      <p>TP CI/CD - Vue.js Chess Application</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChessBoard from './components/ChessBoard.vue';
import MoveHistory from './components/MoveHistory.vue';

const moveHistory = ref([]);

const onMove = (history) => {
  moveHistory.value = history;
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  text-align: center;
  padding: 30px 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.app-header h1 {
  color: #f0d9b5;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  color: #b58863;
  font-size: 1.1rem;
  font-style: italic;
}

.game-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  padding: 40px 20px;
  flex-wrap: wrap;
}

.app-footer {
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  color: #888;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .game-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>

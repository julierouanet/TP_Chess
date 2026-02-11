<template>
  <div class="chessboard-container">
    <div class="game-status" :class="statusClass">
      {{ gameStatus }}
    </div>
    <div class="chessboard" v-if="board.length > 0">
      <!-- Column labels (top) -->
      <div class="column-labels">
        <div class="corner-space"></div>
        <div v-for="col in 8" :key="'top-' + col" class="column-label">
          {{ String.fromCharCode(96 + col) }}
        </div>
      </div>

      <!-- Board rows -->
      <div v-for="row in 8" :key="row" class="board-row">
        <!-- Row label (left) -->
        <div class="row-label">{{ 9 - row }}</div>

        <!-- Squares -->
        <div
          v-for="col in 8"
          :key="row + '-' + col"
          class="square"
          :class="getSquareClass(row - 1, col - 1)"
          @dragover.prevent="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop($event, row - 1, col - 1)"
        >
          <ChessPiece
            v-if="board[row - 1][col - 1]"
            :type="board[row - 1][col - 1].type"
            :color="board[row - 1][col - 1].color"
            :row="row - 1"
            :col="col - 1"
          />
        </div>
      </div>
    </div>
    <div v-else class="loading">Chargement...</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ChessPiece from './ChessPiece.vue';
import { chessService } from '../services/ChessService';

const emit = defineEmits(['move', 'status']);

const board = ref(chessService.getBoard());
const gameStatus = ref(chessService.getStatus());

const statusClass = computed(() => {
  if (chessService.isCheckmate()) return 'checkmate';
  if (chessService.isCheck()) return 'check';
  if (chessService.isDraw() || chessService.isStalemate()) return 'draw';
  return chessService.turn() === 'white' ? 'white-turn' : 'black-turn';
});

const loadBoard = () => {
  board.value = chessService.getBoard();
  gameStatus.value = chessService.getStatus();
};

const getSquareClass = (row, col) => {
  const isLight = (row + col) % 2 === 0;
  return isLight ? 'light' : 'dark';
};

const onDragOver = (event) => {
  event.target.classList.add('drag-over');
};

const onDragLeave = (event) => {
  event.target.classList.remove('drag-over');
};

const onDrop = (event, toRow, toCol) => {
  event.target.classList.remove('drag-over');
  
  try {
    const data = JSON.parse(event.dataTransfer.getData('application/json'));
    const { fromRow, fromCol } = data;
    
    if (fromRow === toRow && fromCol === toCol) {
      return; // No move if dropped on same square
    }

    const success = chessService.movePiece(fromRow, fromCol, toRow, toCol);
    
    if (success) {
      loadBoard();
      emit('move', chessService.getMoveHistory());
      emit('status', gameStatus.value);
    }
  } catch (e) {
    console.error('Error processing drop:', e);
  }
};
</script>

<style scoped>
.chessboard-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.game-status {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 10px 24px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
  min-width: 250px;
  transition: all 0.3s ease;
}

.game-status.white-turn {
  background: rgba(240, 217, 181, 0.2);
  color: #f0d9b5;
  border: 2px solid #f0d9b5;
}

.game-status.black-turn {
  background: rgba(30, 30, 30, 0.5);
  color: #b58863;
  border: 2px solid #b58863;
}

.game-status.check {
  background: rgba(255, 165, 0, 0.3);
  color: #ffa500;
  border: 2px solid #ffa500;
  animation: pulse 1s infinite;
}

.game-status.checkmate {
  background: rgba(220, 53, 69, 0.3);
  color: #ff4444;
  border: 2px solid #ff4444;
  font-size: 1.4rem;
}

.game-status.draw {
  background: rgba(108, 117, 125, 0.3);
  color: #adb5bd;
  border: 2px solid #adb5bd;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.chessboard {
  display: flex;
  flex-direction: column;
  border: 8px solid #4a3728;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.column-labels {
  display: flex;
}

.corner-space {
  width: 30px;
  height: 30px;
}

.column-label {
  width: 70px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #4a3728;
  font-size: 0.9rem;
}

.board-row {
  display: flex;
}

.row-label {
  width: 30px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #4a3728;
  font-size: 0.9rem;
}

.square {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.square.light {
  background-color: #f0d9b5;
}

.square.dark {
  background-color: #b58863;
}

.square.drag-over {
  background-color: #7cfc00 !important;
  opacity: 0.8;
}

.loading {
  color: #f0d9b5;
  font-size: 1.5rem;
  padding: 100px;
}
</style>

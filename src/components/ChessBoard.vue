<template>
  <div class="chessboard-container">
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
import { ref, onMounted } from 'vue';
import ChessPiece from './ChessPiece.vue';
import { chessService } from '../services/ChessService';

const emit = defineEmits(['move']);

const board = ref(chessService.getBoard());

const loadBoard = () => {
  board.value = chessService.getBoard();
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
    }
  } catch (e) {
    console.error('Error processing drop:', e);
  }
};
</script>

<style scoped>
.chessboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
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

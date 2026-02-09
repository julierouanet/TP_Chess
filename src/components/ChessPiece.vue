<template>
  <div 
    class="chess-piece" 
    :class="[color]"
    draggable="true"
    @dragstart="onDragStart"
  >
    {{ pieceSymbol }}
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  row: {
    type: Number,
    required: true
  },
  col: {
    type: Number,
    required: true
  }
});

// Unicode symbols for chess pieces
const pieceSymbols = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

const pieceSymbol = computed(() => {
  return pieceSymbols[props.color]?.[props.type] || '?';
});

const onDragStart = (event) => {
  event.dataTransfer.setData('application/json', JSON.stringify({
    fromRow: props.row,
    fromCol: props.col
  }));
  event.dataTransfer.effectAllowed = 'move';
};
</script>

<style scoped>
.chess-piece {
  font-size: 3rem;
  cursor: grab;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: transform 0.1s ease;
}

.chess-piece:hover {
  transform: scale(1.1);
}

.chess-piece:active {
  cursor: grabbing;
}

.chess-piece.white {
  color: #fff;
  text-shadow: 0 0 3px #000, 0 0 5px #000;
}

.chess-piece.black {
  color: #1a1a1a;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.3);
}
</style>

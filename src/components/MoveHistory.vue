<template>
  <div class="move-history">
    <h3>Historique des coups</h3>
    <div class="moves-list" ref="movesList">
      <div v-if="moves.length === 0" class="no-moves">
        Aucun coup joué
      </div>
      <div 
        v-for="(move, index) in moves" 
        :key="index" 
        class="move-entry"
        :class="{ capture: move.captured }"
      >
        <span class="move-number">{{ index + 1 }}.</span>
        <span class="piece-symbol">{{ getPieceSymbol(move.piece) }}</span>
        <span class="move-notation">
          {{ formatPosition(move.from) }} → {{ formatPosition(move.to) }}
        </span>
        <span v-if="move.captured" class="captured-piece">
          ✕ {{ getPieceSymbol(move.captured) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, nextTick } from 'vue';
import { ChessService } from '../services/ChessService';

const props = defineProps({
  moves: {
    type: Array,
    default: () => []
  }
});

const movesList = ref(null);

// Auto-scroll to bottom when new moves are added
watch(() => props.moves.length, async () => {
  await nextTick();
  if (movesList.value) {
    movesList.value.scrollTop = movesList.value.scrollHeight;
  }
});

const pieceSymbols = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
};

const getPieceSymbol = (piece) => {
  return pieceSymbols[piece.color]?.[piece.type] || '?';
};

const formatPosition = (pos) => {
  return ChessService.formatPosition(pos.row, pos.col);
};
</script>

<style scoped>
.move-history {
  background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
  border-radius: 12px;
  padding: 20px;
  min-width: 250px;
  max-width: 300px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

h3 {
  color: #f0d9b5;
  margin: 0 0 15px 0;
  text-align: center;
  font-size: 1.1rem;
  border-bottom: 2px solid #4a3728;
  padding-bottom: 10px;
}

.moves-list {
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a3728 #1a1a1a;
}

.moves-list::-webkit-scrollbar {
  width: 6px;
}

.moves-list::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.moves-list::-webkit-scrollbar-thumb {
  background-color: #4a3728;
  border-radius: 3px;
}

.no-moves {
  color: #888;
  text-align: center;
  font-style: italic;
  padding: 20px;
}

.move-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin: 4px 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  transition: background 0.2s ease;
}

.move-entry:hover {
  background: rgba(255, 255, 255, 0.1);
}

.move-entry.capture {
  background: rgba(220, 53, 69, 0.2);
}

.move-number {
  color: #888;
  font-size: 0.85rem;
  min-width: 25px;
}

.piece-symbol {
  font-size: 1.3rem;
}

.move-notation {
  color: #f0d9b5;
  font-family: 'Courier New', monospace;
}

.captured-piece {
  color: #dc3545;
  margin-left: auto;
  font-size: 1.1rem;
}
</style>

import { Chess } from 'chess.js';

/**
 * ChessService - Service class for managing chess game state
 * Uses chess.js to enforce legal moves and track game state
 */
export class ChessService {
  constructor() {
    this.chess = new Chess();
    this.moveHistory = [];
  }

  /**
   * Build a board representation from chess.js state
   * Converts chess.js board format to our internal format
   * @returns {Array} 8x8 matrix representing the board
   */
  getBoard() {
    const board = [];
    const chessBoard = this.chess.board();

    const pieceTypeMap = {
      p: 'pawn',
      r: 'rook',
      n: 'knight',
      b: 'bishop',
      q: 'queen',
      k: 'king',
    };

    const colorMap = {
      w: 'white',
      b: 'black',
    };

    for (let row = 0; row < 8; row++) {
      const boardRow = [];
      for (let col = 0; col < 8; col++) {
        const piece = chessBoard[row][col];
        if (piece) {
          boardRow.push({
            type: pieceTypeMap[piece.type],
            color: colorMap[piece.color],
          });
        } else {
          boardRow.push(null);
        }
      }
      board.push(boardRow);
    }

    return board;
  }

  /**
   * Get piece at a specific position
   * @param {number} row - Row index (0-7)
   * @param {number} col - Column index (0-7)
   * @returns {Object|null} Piece object or null if empty
   */
  getPieceAt(row, col) {
    if (row < 0 || row > 7 || col < 0 || col > 7) {
      return null;
    }
    const board = this.getBoard();
    return board[row][col];
  }

  /**
   * Convert row/col to chess.js square notation (e.g., "e4")
   * @param {number} row - Row index (0-7)
   * @param {number} col - Column index (0-7)
   * @returns {string} Square in algebraic notation
   */
  _toSquare(row, col) {
    const file = String.fromCharCode(97 + col); // a-h
    const rank = 8 - row; // 8-1
    return `${file}${rank}`;
  }

  /**
   * Move a piece from one position to another
   * Uses chess.js to validate the move according to chess rules
   * @param {number} fromRow - Starting row
   * @param {number} fromCol - Starting column
   * @param {number} toRow - Target row
   * @param {number} toCol - Target column
   * @returns {boolean} Whether the move was successful (legal)
   */
  movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = this.getPieceAt(fromRow, fromCol);

    if (!piece) {
      return false;
    }

    const from = this._toSquare(fromRow, fromCol);
    const to = this._toSquare(toRow, toCol);

    // Check if target is occupied (for capture tracking)
    const capturedPiece = this.getPieceAt(toRow, toCol);

    try {
      // Try the move - chess.js will validate it
      // Always try promotion to queen for simplicity
      const result = this.chess.move({ from, to, promotion: 'q' });

      if (result) {
        // Record the move in our history format
        this.moveHistory.push({
          piece: { ...piece },
          from: { row: fromRow, col: fromCol },
          to: { row: toRow, col: toCol },
          captured: capturedPiece ? { ...capturedPiece } : null,
          notation: result.san,
          timestamp: new Date(),
        });

        return true;
      }
    } catch (e) {
      // Invalid move - chess.js throws on illegal moves
      return false;
    }

    return false;
  }

  /**
   * Get the full move history
   * @returns {Array} Array of move objects
   */
  getMoveHistory() {
    return [...this.moveHistory];
  }

  /**
   * Get whose turn it is
   * @returns {string} 'white' or 'black'
   */
  turn() {
    return this.chess.turn() === 'w' ? 'white' : 'black';
  }

  /**
   * Check if the current player is in check
   * @returns {boolean}
   */
  isCheck() {
    return this.chess.isCheck();
  }

  /**
   * Check if it's checkmate
   * @returns {boolean}
   */
  isCheckmate() {
    return this.chess.isCheckmate();
  }

  /**
   * Check if the game is over
   * @returns {boolean}
   */
  isGameOver() {
    return this.chess.isGameOver();
  }

  /**
   * Check if it's a draw
   * @returns {boolean}
   */
  isDraw() {
    return this.chess.isDraw();
  }

  /**
   * Check if it's stalemate
   * @returns {boolean}
   */
  isStalemate() {
    return this.chess.isStalemate();
  }

  /**
   * Get the game status as a string
   * @returns {string} Status description
   */
  getStatus() {
    if (this.isCheckmate()) {
      const winner = this.turn() === 'white' ? 'Noirs' : 'Blancs';
      return `Échec et mat ! Les ${winner} gagnent !`;
    }
    if (this.isStalemate()) {
      return 'Pat ! Match nul.';
    }
    if (this.isDraw()) {
      return 'Match nul.';
    }
    if (this.isCheck()) {
      return `Échec ! Au tour des ${this.turn() === 'white' ? 'Blancs' : 'Noirs'}`;
    }
    return `Au tour des ${this.turn() === 'white' ? 'Blancs' : 'Noirs'}`;
  }

  /**
   * Reset the game to initial position
   */
  reset() {
    this.chess.reset();
    this.moveHistory = [];
  }

  /**
   * Convert column index to chess notation (a-h)
   * @param {number} col - Column index
   * @returns {string} Column letter
   */
  static colToLetter(col) {
    return String.fromCharCode(97 + col);
  }

  /**
   * Convert row index to chess notation (1-8)
   * @param {number} row - Row index
   * @returns {string} Row number
   */
  static rowToNumber(row) {
    return String(8 - row);
  }

  /**
   * Format position as chess notation (e.g., "e4")
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {string} Position in chess notation
   */
  static formatPosition(row, col) {
    return `${ChessService.colToLetter(col)}${ChessService.rowToNumber(row)}`;
  }
}

// Singleton instance for the application
export const chessService = new ChessService();

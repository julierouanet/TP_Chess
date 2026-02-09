/**
 * ChessService - Service class for managing chess game state
 * Tracks piece positions and movement history
 */
export class ChessService {
  constructor() {
    this.board = this.initializeBoard();
    this.moveHistory = [];
  }

  /**
   * Initialize the chess board with all pieces in starting positions
   * @returns {Array} 8x8 matrix representing the board
   */
  initializeBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));

    // Piece types for back row
    const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

    // Place black pieces (rows 0-1)
    for (let col = 0; col < 8; col++) {
      board[0][col] = { type: backRow[col], color: 'black' };
      board[1][col] = { type: 'pawn', color: 'black' };
    }

    // Place white pieces (rows 6-7)
    for (let col = 0; col < 8; col++) {
      board[6][col] = { type: 'pawn', color: 'white' };
      board[7][col] = { type: backRow[col], color: 'white' };
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
    return this.board[row][col];
  }

  /**
   * Move a piece from one position to another
   * If target square is occupied, the piece is captured (replaced)
   * @param {number} fromRow - Starting row
   * @param {number} fromCol - Starting column
   * @param {number} toRow - Target row
   * @param {number} toCol - Target column
   * @returns {boolean} Whether the move was successful
   */
  movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = this.getPieceAt(fromRow, fromCol);
    
    if (!piece) {
      return false;
    }

    // Check if target is occupied (capture)
    const capturedPiece = this.getPieceAt(toRow, toCol);

    // Record the move in history
    this.moveHistory.push({
      piece: { ...piece },
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      captured: capturedPiece ? { ...capturedPiece } : null,
      timestamp: new Date()
    });

    // Perform the move
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    return true;
  }

  /**
   * Get the full move history
   * @returns {Array} Array of move objects
   */
  getMoveHistory() {
    return [...this.moveHistory];
  }

  /**
   * Get the current board state
   * @returns {Array} 8x8 board matrix
   */
  getBoard() {
    return this.board.map(row => row.map(cell => cell ? { ...cell } : null));
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

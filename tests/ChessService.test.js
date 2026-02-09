import { describe, it, expect, beforeEach } from 'vitest';
import { ChessService } from '../src/services/ChessService';

describe('ChessService', () => {
    let service;

    beforeEach(() => {
        // Create a fresh instance before each test
        service = new ChessService();
    });

    describe('initializeBoard', () => {
        it('should create an 8x8 board', () => {
            const board = service.getBoard();
            expect(board).toHaveLength(8);
            board.forEach(row => {
                expect(row).toHaveLength(8);
            });
        });

        it('should place black pieces on rows 0 and 1', () => {
            // Black back row
            expect(service.getPieceAt(0, 0)).toEqual({ type: 'rook', color: 'black' });
            expect(service.getPieceAt(0, 1)).toEqual({ type: 'knight', color: 'black' });
            expect(service.getPieceAt(0, 2)).toEqual({ type: 'bishop', color: 'black' });
            expect(service.getPieceAt(0, 3)).toEqual({ type: 'queen', color: 'black' });
            expect(service.getPieceAt(0, 4)).toEqual({ type: 'king', color: 'black' });
            expect(service.getPieceAt(0, 5)).toEqual({ type: 'bishop', color: 'black' });
            expect(service.getPieceAt(0, 6)).toEqual({ type: 'knight', color: 'black' });
            expect(service.getPieceAt(0, 7)).toEqual({ type: 'rook', color: 'black' });

            // Black pawns
            for (let col = 0; col < 8; col++) {
                expect(service.getPieceAt(1, col)).toEqual({ type: 'pawn', color: 'black' });
            }
        });

        it('should place white pieces on rows 6 and 7', () => {
            // White pawns
            for (let col = 0; col < 8; col++) {
                expect(service.getPieceAt(6, col)).toEqual({ type: 'pawn', color: 'white' });
            }

            // White back row
            expect(service.getPieceAt(7, 0)).toEqual({ type: 'rook', color: 'white' });
            expect(service.getPieceAt(7, 1)).toEqual({ type: 'knight', color: 'white' });
            expect(service.getPieceAt(7, 2)).toEqual({ type: 'bishop', color: 'white' });
            expect(service.getPieceAt(7, 3)).toEqual({ type: 'queen', color: 'white' });
            expect(service.getPieceAt(7, 4)).toEqual({ type: 'king', color: 'white' });
            expect(service.getPieceAt(7, 5)).toEqual({ type: 'bishop', color: 'white' });
            expect(service.getPieceAt(7, 6)).toEqual({ type: 'knight', color: 'white' });
            expect(service.getPieceAt(7, 7)).toEqual({ type: 'rook', color: 'white' });
        });

        it('should have empty squares in the middle of the board', () => {
            for (let row = 2; row <= 5; row++) {
                for (let col = 0; col < 8; col++) {
                    expect(service.getPieceAt(row, col)).toBeNull();
                }
            }
        });
    });

    describe('getPieceAt', () => {
        it('should return the piece at a valid position', () => {
            const piece = service.getPieceAt(0, 0);
            expect(piece).toEqual({ type: 'rook', color: 'black' });
        });

        it('should return null for empty squares', () => {
            expect(service.getPieceAt(4, 4)).toBeNull();
        });

        it('should return null for out-of-bounds positions', () => {
            expect(service.getPieceAt(-1, 0)).toBeNull();
            expect(service.getPieceAt(0, -1)).toBeNull();
            expect(service.getPieceAt(8, 0)).toBeNull();
            expect(service.getPieceAt(0, 8)).toBeNull();
        });
    });

    describe('movePiece', () => {
        it('should move a piece to an empty square', () => {
            // Move white pawn from e2 to e4
            const result = service.movePiece(6, 4, 4, 4);

            expect(result).toBe(true);
            expect(service.getPieceAt(6, 4)).toBeNull();
            expect(service.getPieceAt(4, 4)).toEqual({ type: 'pawn', color: 'white' });
        });

        it('should replace a piece when moving to an occupied square', () => {
            // Move white pawn to capture black pawn position
            // First move pawn forward
            service.movePiece(6, 0, 1, 0);

            // Verify white pawn replaced black pawn
            expect(service.getPieceAt(1, 0)).toEqual({ type: 'pawn', color: 'white' });
            expect(service.getPieceAt(6, 0)).toBeNull();
        });

        it('should return false when trying to move from an empty square', () => {
            const result = service.movePiece(4, 4, 5, 5);
            expect(result).toBe(false);
        });

        it('should record captured piece in move history', () => {
            // Move white pawn to black pawn position (capture)
            service.movePiece(6, 0, 1, 0);

            const history = service.getMoveHistory();
            expect(history).toHaveLength(1);
            expect(history[0].captured).toEqual({ type: 'pawn', color: 'black' });
        });
    });

    describe('getMoveHistory', () => {
        it('should start with an empty history', () => {
            expect(service.getMoveHistory()).toHaveLength(0);
        });

        it('should record moves with correct details', () => {
            service.movePiece(6, 4, 4, 4);

            const history = service.getMoveHistory();
            expect(history).toHaveLength(1);
            expect(history[0].piece).toEqual({ type: 'pawn', color: 'white' });
            expect(history[0].from).toEqual({ row: 6, col: 4 });
            expect(history[0].to).toEqual({ row: 4, col: 4 });
            expect(history[0].captured).toBeNull();
            expect(history[0].timestamp).toBeInstanceOf(Date);
        });

        it('should record multiple moves in order', () => {
            service.movePiece(6, 4, 4, 4); // e2 to e4
            service.movePiece(1, 4, 3, 4); // e7 to e5

            const history = service.getMoveHistory();
            expect(history).toHaveLength(2);
            expect(history[0].piece.color).toBe('white');
            expect(history[1].piece.color).toBe('black');
        });
    });

    describe('static helper methods', () => {
        it('colToLetter should convert column index to letter', () => {
            expect(ChessService.colToLetter(0)).toBe('a');
            expect(ChessService.colToLetter(4)).toBe('e');
            expect(ChessService.colToLetter(7)).toBe('h');
        });

        it('rowToNumber should convert row index to chess notation', () => {
            expect(ChessService.rowToNumber(0)).toBe('8');
            expect(ChessService.rowToNumber(7)).toBe('1');
        });

        it('formatPosition should return chess notation', () => {
            expect(ChessService.formatPosition(6, 4)).toBe('e2');
            expect(ChessService.formatPosition(0, 0)).toBe('a8');
            expect(ChessService.formatPosition(7, 7)).toBe('h1');
        });
    });
});

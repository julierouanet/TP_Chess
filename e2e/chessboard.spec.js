import { test, expect } from '@playwright/test';

test.describe('ChessBoard Component', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display the chess board', async ({ page }) => {
        // Check that the chessboard container is visible
        const chessboard = page.locator('.chessboard');
        await expect(chessboard).toBeVisible();
    });

    test('should display 64 squares (8x8 grid)', async ({ page }) => {
        const squares = page.locator('.square');
        await expect(squares).toHaveCount(64);
    });

    test('should have alternating light and dark squares', async ({ page }) => {
        const lightSquares = page.locator('.square.light');
        const darkSquares = page.locator('.square.dark');

        await expect(lightSquares).toHaveCount(32);
        await expect(darkSquares).toHaveCount(32);
    });

    test('should display all 32 chess pieces at start', async ({ page }) => {
        const pieces = page.locator('.chess-piece');
        await expect(pieces).toHaveCount(32);
    });

    test('should display 16 white pieces', async ({ page }) => {
        const whitePieces = page.locator('.chess-piece.white');
        await expect(whitePieces).toHaveCount(16);
    });

    test('should display 16 black pieces', async ({ page }) => {
        const blackPieces = page.locator('.chess-piece.black');
        await expect(blackPieces).toHaveCount(16);
    });

    test('should display column labels (a-h)', async ({ page }) => {
        const columnLabels = page.locator('.column-label');
        await expect(columnLabels).toHaveCount(8);

        // Check the labels contain a-h
        const labels = await columnLabels.allTextContents();
        expect(labels).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
    });

    test('should display row labels (1-8)', async ({ page }) => {
        const rowLabels = page.locator('.row-label');
        await expect(rowLabels).toHaveCount(8);

        // Check the labels contain 8-1 (from top to bottom)
        const labels = await rowLabels.allTextContents();
        expect(labels).toEqual(['8', '7', '6', '5', '4', '3', '2', '1']);
    });

    test('should display the move history panel', async ({ page }) => {
        const historyPanel = page.locator('.move-history');
        await expect(historyPanel).toBeVisible();

        // Should show "Aucun coup joué" initially
        await expect(page.locator('.no-moves')).toBeVisible();
    });

    test('should display page title', async ({ page }) => {
        const title = page.locator('h1');
        await expect(title).toContainText("Jeu d'Échecs");
    });

    test('should display game status', async ({ page }) => {
        const status = page.locator('.game-status');
        await expect(status).toBeVisible();
        await expect(status).toContainText('Blancs');
    });
});

test.describe('ChessBoard Drag and Drop', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should allow dragging a piece', async ({ page }) => {
        // Get a white pawn (row 7, second from left)
        const pieces = page.locator('.chess-piece.white');
        const pawn = pieces.nth(8); // First pawn

        // Check that piece is draggable
        await expect(pawn).toHaveAttribute('draggable', 'true');
    });

    test('should move a piece when drag and drop (legal move)', async ({ page }) => {
        // Get the source square (e2 - white pawn)
        const sourceSquare = page.locator('.board-row').nth(6).locator('.square').nth(4);
        const targetSquare = page.locator('.board-row').nth(4).locator('.square').nth(4);

        // Get the pawn in source square
        const pawn = sourceSquare.locator('.chess-piece');
        await expect(pawn).toBeVisible();

        // Perform drag and drop (e2 to e4 - legal move)
        await pawn.dragTo(targetSquare);

        // Verify pawn moved to target
        const movedPawn = targetSquare.locator('.chess-piece');
        await expect(movedPawn).toBeVisible();

        // Verify source is now empty
        const sourcePawn = sourceSquare.locator('.chess-piece');
        await expect(sourcePawn).toHaveCount(0);
    });

    test('should update move history after a legal move', async ({ page }) => {
        // Move a pawn (e2 to e4 - legal move)
        const sourceSquare = page.locator('.board-row').nth(6).locator('.square').nth(4);
        const targetSquare = page.locator('.board-row').nth(4).locator('.square').nth(4);

        const pawn = sourceSquare.locator('.chess-piece');
        await pawn.dragTo(targetSquare);

        // Check move history is updated
        const moveEntry = page.locator('.move-entry');
        await expect(moveEntry).toHaveCount(1);

        // "Aucun coup joué" should be hidden
        await expect(page.locator('.no-moves')).toHaveCount(0);
    });

    test('should capture piece with a legal capture move', async ({ page }) => {
        // Play a legal sequence to capture: e2-e4, d7-d5, e4xd5

        // 1. White: e2 to e4
        const e2Square = page.locator('.board-row').nth(6).locator('.square').nth(4);
        const e4Square = page.locator('.board-row').nth(4).locator('.square').nth(4);
        const whitePawn = e2Square.locator('.chess-piece');
        await whitePawn.dragTo(e4Square);

        // 2. Black: d7 to d5
        const d7Square = page.locator('.board-row').nth(1).locator('.square').nth(3);
        const d5Square = page.locator('.board-row').nth(3).locator('.square').nth(3);
        const blackPawn = d7Square.locator('.chess-piece');
        await blackPawn.dragTo(d5Square);

        // 3. White: e4 captures d5
        const e4Pawn = e4Square.locator('.chess-piece');
        await e4Pawn.dragTo(d5Square);

        // Verify only white piece is in target square (replaced black)
        const targetPiece = d5Square.locator('.chess-piece');
        await expect(targetPiece).toHaveCount(1);
        await expect(targetPiece).toHaveClass(/white/);

        // Verify capture is recorded in history
        const capturedIndicator = page.locator('.captured-piece');
        await expect(capturedIndicator).toHaveCount(1);
    });

    test('should have 31 pieces after one capture', async ({ page }) => {
        // Play a legal capture sequence: e2-e4, d7-d5, e4xd5

        // 1. White: e2 to e4
        const e2Square = page.locator('.board-row').nth(6).locator('.square').nth(4);
        const e4Square = page.locator('.board-row').nth(4).locator('.square').nth(4);
        await e2Square.locator('.chess-piece').dragTo(e4Square);

        // 2. Black: d7 to d5
        const d7Square = page.locator('.board-row').nth(1).locator('.square').nth(3);
        const d5Square = page.locator('.board-row').nth(3).locator('.square').nth(3);
        await d7Square.locator('.chess-piece').dragTo(d5Square);

        // 3. White: e4xd5
        await e4Square.locator('.chess-piece').dragTo(d5Square);

        // Total pieces should be 31 after capture
        const allPieces = page.locator('.chess-piece');
        await expect(allPieces).toHaveCount(31);
    });

    test('should reject an illegal move (piece stays in place)', async ({ page }) => {
        // Try to move white pawn from a2 directly to a5 (illegal - 3 squares)
        const a2Square = page.locator('.board-row').nth(6).locator('.square').nth(0);
        const a5Square = page.locator('.board-row').nth(3).locator('.square').nth(0);

        const pawn = a2Square.locator('.chess-piece');
        await pawn.dragTo(a5Square);

        // Pawn should still be in original position
        await expect(a2Square.locator('.chess-piece')).toHaveCount(1);
        // Target should still be empty
        await expect(a5Square.locator('.chess-piece')).toHaveCount(0);

        // Still 32 pieces on the board
        const allPieces = page.locator('.chess-piece');
        await expect(allPieces).toHaveCount(32);
    });
});

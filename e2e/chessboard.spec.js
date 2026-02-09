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

    test('should move a piece when drag and drop', async ({ page }) => {
        // Get the source square (e2 - white pawn)
        const sourceSquare = page.locator('.board-row').nth(6).locator('.square').nth(4);
        const targetSquare = page.locator('.board-row').nth(4).locator('.square').nth(4);

        // Get the pawn in source square
        const pawn = sourceSquare.locator('.chess-piece');
        await expect(pawn).toBeVisible();

        // Perform drag and drop
        await pawn.dragTo(targetSquare);

        // Verify pawn moved to target
        const movedPawn = targetSquare.locator('.chess-piece');
        await expect(movedPawn).toBeVisible();

        // Verify source is now empty
        const sourcePawn = sourceSquare.locator('.chess-piece');
        await expect(sourcePawn).toHaveCount(0);
    });

    test('should update move history after a move', async ({ page }) => {
        // Move a pawn
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

    test('should capture piece when moving to occupied square', async ({ page }) => {
        // Move white pawn directly to black pawn position (capture)
        const whitePawnSquare = page.locator('.board-row').nth(6).locator('.square').nth(0);
        const blackPawnSquare = page.locator('.board-row').nth(1).locator('.square').nth(0);

        const whitePawn = whitePawnSquare.locator('.chess-piece');
        await whitePawn.dragTo(blackPawnSquare);

        // Verify only white piece is in target square (replaced black)
        const targetPiece = blackPawnSquare.locator('.chess-piece');
        await expect(targetPiece).toHaveCount(1);
        await expect(targetPiece).toHaveClass(/white/);

        // Verify capture is recorded in history
        const capturedIndicator = page.locator('.captured-piece');
        await expect(capturedIndicator).toHaveCount(1);
    });

    test('should have 31 pieces after one capture', async ({ page }) => {
        // Perform a capture
        const whitePawnSquare = page.locator('.board-row').nth(6).locator('.square').nth(0);
        const blackPawnSquare = page.locator('.board-row').nth(1).locator('.square').nth(0);

        const whitePawn = whitePawnSquare.locator('.chess-piece');
        await whitePawn.dragTo(blackPawnSquare);

        // Total pieces should be 31 after capture
        const allPieces = page.locator('.chess-piece');
        await expect(allPieces).toHaveCount(31);
    });
});

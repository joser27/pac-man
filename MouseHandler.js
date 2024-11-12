class MouseHandler {
    constructor(canvas, matrix, squareWidth, squareHeight, redrawCallback, player, zombie) {
        this.canvas = canvas;
        this.matrix = matrix;
        this.squareWidth = squareWidth;
        this.squareHeight = squareHeight;
        this.redrawCallback = redrawCallback;
        this.player = player;
        this.zombie = zombie;

        this.initializeMouseListener();
    }

    initializeMouseListener() {
        this.canvas.addEventListener('click', (event) => this.handleClick(event));
    }

    handleClick(event) {
        // Get mouse position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Convert mouse position to matrix coordinates
        const matrixX = Math.floor(mouseX / this.squareWidth);
        const matrixY = Math.floor(mouseY / this.squareHeight);

        // Check if the clicked cell is occupied by the player or zombie
        if ((this.player.x === matrixX && this.player.y === matrixY) ||
            (this.zombie.x === matrixX && this.zombie.y === matrixY)) {
            return; // Exit without making changes if occupied by player or zombie
        }

        // Toggle wall on or off
        if (this.matrix[matrixY][matrixX] === 1) {
            this.matrix[matrixY][matrixX] = 0; // Remove wall
        } else {
            this.matrix[matrixY][matrixX] = 1; // Place wall
        }

        // Call the redraw callback to update the game loop
        if (this.redrawCallback) {
            this.redrawCallback();
        }
    }
}

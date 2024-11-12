class KeyListener {
    constructor(player, matrix, game) {
        this.player = player;
        this.matrix = matrix;
        this.game = game; // Reference to the Game instance
        this.initializeKeyListener();
    }

    initializeKeyListener() {
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    isWalkable(x, y) {
        if (y >= 0 && y < this.matrix.length && x >= 0 && x < this.matrix[0].length) {
            return this.matrix[y][x] === 0; 
        }
        return false; // Out of bounds
    }

    handleKeyPress(event) {
        let newX = this.player.x;
        let newY = this.player.y;

        switch(event.key) {
            case 'w':
                newY -= 1;
                break;
            case 'a':
                newX -= 1;
                break;
            case 's':
                newY += 1;
                break;
            case 'd':
                newX += 1;
                break;
            case 'e': // Toggle cost display on 'e' press
                this.game.showCosts = !this.game.showCosts;
                break;
        }

        if (this.isWalkable(newX, newY)) {
            this.player.x = newX;
            this.player.y = newY;
        }
    }
}

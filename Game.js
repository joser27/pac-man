class Game {
    constructor(canvasId) {
        this.canvas = document.querySelector(canvasId);
        this.context = this.canvas.getContext('2d');
        this.canvas.width = 1024;
        this.canvas.height = 576;
        this.matrix = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        this.rows = this.matrix.length;
        this.cols = this.matrix[0].length;
        this.squareWidth = this.canvas.width / this.cols;
        this.squareHeight = this.canvas.height / this.rows;

        this.player = new Player(10, 5);
        this.zombie = new Zombie(7, 2);
        this.astar = new AStar();
        this.showCosts = false; 
        this.keyListener = new KeyListener(this.player, this.matrix, this);
        this.mouseHandler = new MouseHandler(
            this.canvas, 
            this.matrix, 
            this.squareWidth, 
            this.squareHeight, 
            () => this.loop(),
            this.player,
            this.zombie
        );
        this.loop();
    }

    loop() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.pathing = this.astar.path(this.player, this.zombie, this.matrix);
        const nodeMatrix = this.astar.nodeMatrix;

        this.drawMatrix(nodeMatrix);

        this.player.draw(this.context, this.squareWidth, this.squareHeight);
        this.zombie.draw(this.context, this.squareWidth, this.squareHeight);

        if (this.pathing) { 
            this.drawPath(this.pathing);
        }

        window.requestAnimationFrame(() => this.loop());
    }

    drawMatrix(nodeMatrix) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.matrix[y][x] === 1) {
                    this.context.fillStyle = 'grey';
                    this.context.fillRect(x * this.squareWidth, y * this.squareHeight, this.squareWidth, this.squareHeight);
                } else {
                    this.context.strokeStyle = 'black';
                    this.context.strokeRect(x * this.squareWidth, y * this.squareHeight, this.squareWidth, this.squareHeight);
                }

                if (this.showCosts) { // Check if costs should be displayed
                    const node = nodeMatrix[y][x];
                    if (node && node.isWalkable) {
                        this.context.fillStyle = 'blue';
                        this.context.font = '10px Arial';
                        this.context.fillText(`G:${node.gCost}`, x * this.squareWidth + 2, y * this.squareHeight + 10);
                        this.context.fillText(`H:${node.hCost}`, x * this.squareWidth + 2, y * this.squareHeight + 20);
                        this.context.fillText(`F:${node.fCost}`, x * this.squareWidth + 2, y * this.squareHeight + 30);

                        if (node.parent) {
                            this.context.fillText(`P:(${node.parent.x},${node.parent.y})`, x * this.squareWidth + 2, y * this.squareHeight + 40);
                        }
                    }
                }
            }
        }
    }

    drawPath(path) {
        for (let tile of path) {
            this.context.fillStyle = 'rgba(0,255,0,0.3)';
            this.context.fillRect(tile[0] * this.squareWidth, tile[1] * this.squareHeight, this.squareWidth, this.squareHeight);
        }
    }
}

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const matrix = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const tileMatrix = [];

for (let i = 0; i < matrix.length; i++) {
    const row = [];
    for (let j = 0; j < matrix[i].length; j++) {
        const tile = {
            x: j, // x coordinate is the column index
            y: i, // y coordinate is the row index
            visited: false,
            value: matrix[i][j],
            parent: null, // Initialize parent as null
        };
        row.push(tile);
    }
    tileMatrix.push(row);
}

const rows = matrix.length;
const cols = matrix[0].length;
const squareWidth = canvas.width / cols;
const squareHeight = canvas.height / rows;

const player = {
    x: 1,
    y: 1,
}

const zombie = {
    x: 14,
    y: 1,
}

function loop() {
    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
    // player draw
    c.fillStyle = 'red'
    c.fillRect(player.x * squareWidth, player.y * squareHeight, squareWidth, squareHeight);
    // zombie draw
    c.fillStyle = 'orange'
    c.fillRect(zombie.x * squareWidth, zombie.y * squareHeight, squareWidth, squareHeight);

    // Draw the matrix
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (matrix[y][x] === 1) {
                c.fillStyle = 'grey';
                c.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            } else if (matrix[y][x] === 0) {
                c.fillStyle = 'black';
                c.strokeRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            }
            
            // Print visited cells
            if (tileMatrix[y][x].visited) {
                c.fillStyle = 'rgba(0,255,0,0.4)';
                c.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            }

            // Print the path in blue
            if (tileMatrix[y][x].path) {
                c.fillStyle = 'blue';
                c.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            }
        }
    }
    window.requestAnimationFrame(loop);
}
loop();

function path(entity, targetX, targetY) {
    const stack = new Stack();
    stack.push(tileMatrix[entity.y][entity.x]);

    const directions = [
        [0, 1],   // Right
        [0, -1],  // Left
        [1, 0],   // Down
        [-1, 0],  // Up
        [1, 1],   // Diagonal down-right
        [-1, -1], // Diagonal up-left
        [1, -1],  // Diagonal down-left
        [-1, 1],  // Diagonal up-right
    ];
    
    while(stack.size() > 0) {
        let tile = stack.pop();
        console.log(tile);
        
        if (!tile.visited) {
            tile.visited = true; // Mark the tile as visited

            for (const [dx, dy] of directions) {
                const ni = tile.y + dy;
                const nj = tile.x + dx;

                if (ni >= 0 && ni < rows && nj >= 0 && nj < cols &&
                    tileMatrix[ni][nj].value !== 1 && !tileMatrix[ni][nj].visited) {
                    tileMatrix[ni][nj].parent = tile; // Set parent for path reconstruction
                    stack.push(tileMatrix[ni][nj]);
                }
            }
        }

        // Check if the current tile matches the target position
        if (tile.x === targetX && tile.y === targetY) {
            console.log("Reached target position!");
            
            // Reconstruct the path
            let pathTile = tile;
            while (pathTile) {
                pathTile.path = true; // Mark the path
                pathTile = pathTile.parent;
            }
            break; // Stop the loop
        }
    }
}

window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w':
            path(zombie, player.x, player.y);
            break;
    }
});

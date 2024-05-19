const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const matrix = [
    [1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,1],
    [1,0,0,1,0,0,0,1],
    [1,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1],
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
    x: 6,
    y: 1,
}
//path(zombie)
function loop() {
    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
    // player draw
    c.fillStyle='red'
    c.fillRect(player.x * squareWidth, player.y * squareHeight, squareWidth, squareHeight);
    // zombie draw
    c.fillStyle='orange'
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
                c.fillStyle = 'blue';
                c.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            }
        }
    }
    window.requestAnimationFrame(loop);
}
loop();

function path(entity) {
    const stack = new Stack();
    stack.push(tileMatrix[entity.y][entity.x]);

    while(stack.size() > 0) {
        let tile = stack.pop();
        console.log(tile);
        
        if (!tile.visited) {
            tile.visited = true; // Mark the tile as visited

            // Check the tile above (up)
            if (tile.y > 0 && tileMatrix[tile.y - 1][tile.x].value !== 1 && !tileMatrix[tile.y - 1][tile.x].visited) {
                console.log("Path up");
                stack.push(tileMatrix[tile.y - 1][tile.x]);
            }

            // Check the tile below (down)
            if (tile.y < rows - 1 && tileMatrix[tile.y + 1][tile.x].value !== 1 && !tileMatrix[tile.y + 1][tile.x].visited) {
                console.log("Path down");
                stack.push(tileMatrix[tile.y + 1][tile.x]);
            }

            // Check the tile to the left (left)
            if (tile.x > 0 && tileMatrix[tile.y][tile.x - 1].value !== 1 && !tileMatrix[tile.y][tile.x - 1].visited) {
                console.log("Path left");
                stack.push(tileMatrix[tile.y][tile.x - 1]);
            }

            // Check the tile to the right (right)
            if (tile.x < cols - 1 && tileMatrix[tile.y][tile.x + 1].value !== 1 && !tileMatrix[tile.y][tile.x + 1].visited) {
                console.log("Path right");
                stack.push(tileMatrix[tile.y][tile.x + 1]);
            }
        }
    }
}
window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w':
            
            break

}})







const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const matrix = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
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
                c.fillStyle = 'blue'; // Change to green or any other color
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

    const delay = 100; // Delay between steps (in milliseconds)

    function explore() {
        if (stack.size() > 0) {
            let tile = stack.pop();
            tile.visited = true; // Mark the tile as visited

            // Check adjacent tiles and push them onto the stack if valid
            if (tile.y > 0 && tileMatrix[tile.y - 1][tile.x].value !== 1 && !tileMatrix[tile.y - 1][tile.x].visited) {
                stack.push(tileMatrix[tile.y - 1][tile.x]); // Up
            }
            if (tile.y < rows - 1 && tileMatrix[tile.y + 1][tile.x].value !== 1 && !tileMatrix[tile.y + 1][tile.x].visited) {
                stack.push(tileMatrix[tile.y + 1][tile.x]); // Down
            }
            if (tile.x > 0 && tileMatrix[tile.y][tile.x - 1].value !== 1 && !tileMatrix[tile.y][tile.x - 1].visited) {
                stack.push(tileMatrix[tile.y][tile.x - 1]); // Left
            }
            if (tile.x < cols - 1 && tileMatrix[tile.y][tile.x + 1].value !== 1 && !tileMatrix[tile.y][tile.x + 1].visited) {
                stack.push(tileMatrix[tile.y][tile.x + 1]); // Right
            }

            setTimeout(explore, delay); // Recursive call with delay
        }
    }

    explore();
}
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            path(zombie); // Start DFS from zombie's position
            break;
        // Handle other keys if needed
    }
});







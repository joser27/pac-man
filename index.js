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
            state: null, //1 indicates open, 0 closed
            value: matrix[i][j],
            cost: 999,
            parent: null,
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
let backtrack = [];
function loop() {
    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
    // player draw
    c.fillStyle = 'blue'
    c.fillRect(player.x * squareWidth, player.y * squareHeight, squareWidth, squareHeight);
    // zombie draw
    c.fillStyle = 'orange'
    c.fillRect(zombie.x * squareWidth, zombie.y * squareHeight, squareWidth, squareHeight);

    // Draw the matrix
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] === 1) {
                c.fillStyle = 'grey';
                c.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            } else if (matrix[y][x] === 0) {
                c.fillStyle = 'black';
                c.strokeRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            }
            // Print visited cells
            if (tileMatrix[y][x].state !== null) {
                c.fillStyle = 'rgba(255,0,0,0.8)';
                c.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            }
            
            // Draw text for state, cost, and coordinates
            const textX = x * squareWidth + squareWidth / 6; // Adjust position for better visibility
            const textY = y * squareHeight + squareHeight / 3; // Adjust position for better visibility
            c.fillStyle = 'white';
            c.font = '8px Arial';
            c.fillText(`(${tileMatrix[y][x].x},${tileMatrix[y][x].y})`, textX, textY - 6);
            c.fillText(`State: ${tileMatrix[y][x].state}`, textX, textY + 2);
            c.fillText(`Cost: ${tileMatrix[y][x].cost}`, textX, textY + 10);
        }
    }

    for (let i = 0; i < backtrack.length; i++) {
        let tile = backtrack[i];
        c.fillStyle = 'rgba(0,255,0,0.3)';
        c.fillRect(tile.x * squareWidth, tile.y * squareHeight, squareWidth, squareHeight);
    }
    window.requestAnimationFrame(loop);
}
loop();

function path(entity, target) {
    //console.log(tileMatrix[entity.y][entity.x].cost)
    //set first tile
    tileMatrix[entity.y][entity.x].cost = 0;
    tileMatrix[entity.y][entity.x].state = 1;
    let tile = tileMatrix[entity.y][entity.x];
    console.log("First tile: ")
    console.log(tile)

    count=0;
    while (count < 100) {
        tile = findNextInterestedTile(tileMatrix);
        if (tile.x === target.x && tile.y === target.y) {
            //backtrack
            console.log("Target found, starting backtracking...");
            while (tile.parent !== null) {
                backtrack.push(tile);
                tile = tile.parent;
            }
            backtrack.push(tileMatrix[entity.y][entity.x]); // dont forget to add the start tile

            break;
        }
        
        tileMatrix[tile.y][tile.x].state = 0;
        console.log("next interested tile: ")
        console.log(tile)
        if (tile.y > 0 && tileMatrix[tile.y - 1][tile.x].value !== 1 && tileMatrix[tile.y - 1][tile.x].state !== 0) {
            tileMatrix[tile.y - 1][tile.x].state = 1; // change to open state
            // for each non infinite neighbor, find the lowest g cost
            console.log("u")
            lookAtNeighbors(tileMatrix[tile.y - 1][tile.x])
            
        }
        if (tile.y < rows - 1 && tileMatrix[tile.y + 1][tile.x].value !== 1 && tileMatrix[tile.y + 1][tile.x].state !== 0) {
            tileMatrix[tile.y + 1][tile.x].state = 1 // change to open
            console.log("d")
            lookAtNeighbors(tileMatrix[tile.y + 1][tile.x])
            
        }
        if (tile.x > 0 && tileMatrix[tile.y][tile.x - 1].value !== 1 && tileMatrix[tile.y][tile.x - 1].state !== 0) {
            tileMatrix[tile.y][tile.x - 1].state = 1 
            console.log("l")
            lookAtNeighbors(tileMatrix[tile.y][tile.x - 1])
            
        }
        if (tile.x < cols - 1 && tileMatrix[tile.y][tile.x + 1].value !== 1 && tileMatrix[tile.y][tile.x + 1].state !== 0) {
            tileMatrix[tile.y][tile.x + 1].state = 1 
            console.log("r")
            lookAtNeighbors(tileMatrix[tile.y][tile.x + 1])
            
        }
        count++;
        console.log(count)
    }

}

function findNextInterestedTile(tileMatrix) {
    let minCostTile = null;

    for (let i = 0; i < tileMatrix.length; i++) {
        for (let j = 0; j < tileMatrix[i].length; j++) {
            if (tileMatrix[i][j].state === 1) {
                if (minCostTile === null || tileMatrix[i][j].cost < minCostTile.cost) {
                    minCostTile = tileMatrix[i][j];
                }
            }
        }
    }

    return minCostTile;
}

function lookAtNeighbors(tile){
    if (tile.y > 0 && tileMatrix[tile.y - 1][tile.x].value !== 1 && tileMatrix[tile.y - 1][tile.x].cost !== 999) {//up
        console.log("non infinite neigbor up")
        tile.cost = tileMatrix[tile.y - 1][tile.x].cost + 10;
        tile.parent = tileMatrix[tile.y - 1][tile.x]
    }
    if (tile.y < rows - 1 && tileMatrix[tile.y + 1][tile.x].value !== 1 && tileMatrix[tile.y + 1][tile.x].cost !== 999) {//down
        console.log("non infinite neigbor d")
        tile.cost = tileMatrix[tile.y + 1][tile.x].cost + 10;
        tile.parent = tileMatrix[tile.y + 1][tile.x]
    }
    if (tile.x > 0 && tileMatrix[tile.y][tile.x - 1].value !== 1 && tileMatrix[tile.y][tile.x - 1].cost !== 999) {//left
        console.log("non infinite neigbor l")
        tile.cost = tileMatrix[tile.y][tile.x - 1].cost + 10;
        tile.parent = tileMatrix[tile.y][tile.x - 1]
    }
    if (tile.x < cols - 1 && tileMatrix[tile.y][tile.x + 1].value !== 1 && tileMatrix[tile.y][tile.x + 1].cost !== 999) {//right
        console.log("non infinite neigbor r")
        tile.cost = tileMatrix[tile.y][tile.x + 1].cost + 10;
        tile.parent = tileMatrix[tile.y][tile.x + 1];
    }
}

window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w':
            path(zombie, player);
            break;
    }
});

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
// const tileMatrix = [];


// for (let i = 0; i < matrix.length; i++) {
//     const row = [];
//     for (let j = 0; j < matrix[i].length; j++) {
//         const tile = {
//             x: j, // x coordinate is the column index
//             y: i, // y coordinate is the row index
//             state: null, //1 indicates open, 0 closed
//             value: matrix[i][j],
//             cost: 999,
//             parent: null,
//         };
//         row.push(tile);
//     }
//     tileMatrix.push(row);
// }

const rows = matrix.length;
const cols = matrix[0].length;
const squareWidth = canvas.width / cols;
const squareHeight = canvas.height / rows;

const player = new Player(1*squareWidth,1*squareHeight,squareWidth,squareHeight)
const zombie = new Zombie(14*squareWidth,1*squareHeight,squareWidth,squareHeight)

let backtrack = [];
let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;
let frame = 0;
function loop() {
    frame++;
    if (frame>100) {
        frame=0;
        path(zombie, player);
    }
    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
    // player draw
    c.fillStyle = 'blue'
    c.fillRect(player.hitBox.x, player.hitBox.y, player.width, player.height);
    // zombie draw
    c.fillStyle = 'orange'
    c.fillRect(zombie.hitBox.x, zombie.hitBox.y, zombie.width, zombie.height);
    // if (!zombie.hitBox.intersects(player.hitBox)) {
    //     path(zombie,player);
    // }
    
    // Update player position based on movement flags
    updatePlayerPosition();
    if (backtrack.length > 1) {
        const nextTile = backtrack[backtrack.length - 2];
        if (zombie.hitBox.x < nextTile.x * squareWidth) {
            zombie.hitBox.x += 1;
        } else if (zombie.hitBox.x > nextTile.x * squareWidth) {
            zombie.hitBox.x -= 1;
        }
    
        if (zombie.hitBox.y < nextTile.y * squareHeight) {
            zombie.hitBox.y += 1;
        } else if (zombie.hitBox.y > nextTile.y * squareHeight) {
            zombie.hitBox.y -= 1;
        }
    
        // Check if the zombie has reached or exceeded the nextTile position
        if (Math.abs(zombie.hitBox.x - nextTile.x * squareWidth) <= 1 && Math.abs(zombie.hitBox.y - nextTile.y * squareHeight) <= 1) {
            // Remove the current tile from the backtrack array
            backtrack.pop();
        }
    }
    
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
            // Draw text for state, cost, and coordinates
            const textX = x * squareWidth + squareWidth / 6; // Adjust position for better visibility
            const textY = y * squareHeight + squareHeight / 3; // Adjust position for better visibility
            c.fillStyle = 'white';
            c.font = '8px Arial';
            // c.fillText(`(${tileMatrix[y][x].x},${tileMatrix[y][x].y})`, textX, textY - 6);
            // c.fillText(`State: ${tileMatrix[y][x].state}`, textX, textY + 2);
            // c.fillText(`Cost: ${tileMatrix[y][x].cost}`, textX, textY + 10);
        }
    }

    for (let i = 0; i < backtrack.length; i++) {
        let tile = backtrack[i];
        console.log(tile)
        c.fillStyle = 'rgba(0,255,0,0.3)';
        c.fillRect(tile.x * squareWidth, tile.y * squareHeight, squareWidth, squareHeight);
    }
    window.requestAnimationFrame(loop);
}
loop();

function path(entity, target) {
    //console.log(tileMatrix[entity.y][entity.x].cost)
    //set first tile
    
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
    // console.log("AYOO");
    // console.log(Math.round(entity.hitBox.y/squareHeight))
    // console.log(Math.round(entity.hitBox.x/squareWidth))
    tileMatrix[Math.floor(entity.hitBox.y/squareHeight)][Math.floor(entity.hitBox.x/squareWidth)].cost = 0;
    tileMatrix[Math.floor(entity.hitBox.y/squareHeight)][Math.floor(entity.hitBox.x/squareWidth)].state = 1;
    let tile = tileMatrix[Math.floor(entity.hitBox.y/squareHeight)][Math.floor(entity.hitBox.x/squareWidth)];
    // console.log("First tile: ")
    // console.log(tile)

    count=0;
    while (count < 100) {
        tile = findNextInterestedTile(tileMatrix);
        
        // Check if tile is undefined (no interested tiles left)
        if (tile === undefined) {
            console.log("No interested tiles left.");
            break;
        }

        
        if (tile.x === Math.floor(target.hitBox.x/squareWidth) && tile.y === Math.floor(target.hitBox.y/squareHeight)) {
            //backtrack
            backtrack = [];
            console.log("Target found, starting backtracking...");
            while (tile.parent !== null) {
                backtrack.push(tile);
                tile = tile.parent;
            }
            //backtrack.push(tileMatrix[entity.hitBox.y/squareHeight][entity.hitBox.x/squareWidth]); // dont forget to add the start tile

            break;
        }
        tileMatrix[tile.y][tile.x].state = 0;
        // console.log("next interested tile: ")
        // console.log(tile)
        if (tile.y > 0 && tileMatrix[tile.y - 1][tile.x].value !== 1 && tileMatrix[tile.y - 1][tile.x].state !== 0) {
            tileMatrix[tile.y - 1][tile.x].state = 1; // change to open state
            // for each non infinite neighbor, find the lowest g cost
            //console.log("u")
            lookAtNeighbors(tileMatrix[tile.y - 1][tile.x], tileMatrix)
        }
        if (tile.y < rows - 1 && tileMatrix[tile.y + 1][tile.x].value !== 1 && tileMatrix[tile.y + 1][tile.x].state !== 0) {
            tileMatrix[tile.y + 1][tile.x].state = 1 // change to open
            //console.log("d")
            lookAtNeighbors(tileMatrix[tile.y + 1][tile.x], tileMatrix)
        }
        if (tile.x > 0 && tileMatrix[tile.y][tile.x - 1].value !== 1 && tileMatrix[tile.y][tile.x - 1].state !== 0) {
            tileMatrix[tile.y][tile.x - 1].state = 1 
            //console.log("l")
            lookAtNeighbors(tileMatrix[tile.y][tile.x - 1], tileMatrix)
        }
        if (tile.x < cols - 1 && tileMatrix[tile.y][tile.x + 1].value !== 1 && tileMatrix[tile.y][tile.x + 1].state !== 0) {
            tileMatrix[tile.y][tile.x + 1].state = 1 
            //console.log("r")
            lookAtNeighbors(tileMatrix[tile.y][tile.x + 1], tileMatrix)
        }
        count++;
        //console.log(count)
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

function lookAtNeighbors(tile, tileMatrix){
    if (tile.y > 0 && tileMatrix[tile.y - 1][tile.x].value !== 1 && tileMatrix[tile.y - 1][tile.x].cost !== 999) {//up
        //console.log("non infinite neigbor up")
        tile.cost = tileMatrix[tile.y - 1][tile.x].cost + 10;
        tile.parent = tileMatrix[tile.y - 1][tile.x]
    }
    if (tile.y < rows - 1 && tileMatrix[tile.y + 1][tile.x].value !== 1 && tileMatrix[tile.y + 1][tile.x].cost !== 999) {//down
        //console.log("non infinite neigbor d")
        tile.cost = tileMatrix[tile.y + 1][tile.x].cost + 10;
        tile.parent = tileMatrix[tile.y + 1][tile.x]
    }
    if (tile.x > 0 && tileMatrix[tile.y][tile.x - 1].value !== 1 && tileMatrix[tile.y][tile.x - 1].cost !== 999) {//left
        //console.log("non infinite neigbor l")
        tile.cost = tileMatrix[tile.y][tile.x - 1].cost + 10;
        tile.parent = tileMatrix[tile.y][tile.x - 1]
    }
    if (tile.x < cols - 1 && tileMatrix[tile.y][tile.x + 1].value !== 1 && tileMatrix[tile.y][tile.x + 1].cost !== 999) {//right
        //console.log("non infinite neigbor r")
        tile.cost = tileMatrix[tile.y][tile.x + 1].cost + 10;
        tile.parent = tileMatrix[tile.y][tile.x + 1];
    }
}
// Add key up event listener to stop player movement
window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'w':
            moveUp = false;
            break;
        case 'a':
            moveLeft = false;
            break;
        case 's':
            moveDown = false;
            break;
        case 'd':
            moveRight = false;
            break;
    }
});

// Add key down event listener to start player movement
window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w':
            moveUp = true;
            break;
        case 'a':
            moveLeft = true;
            break;
        case 's':
            moveDown = true;
            break;
        case 'd':
            moveRight = true;
            break;
        case 'p':
            path(zombie, player);
            break;
    }
});

// Update player position based on movement flags
function updatePlayerPosition() {
    if (moveUp) {
        player.hitBox.y -= 5;
    }
    if (moveLeft) {
        player.hitBox.x -= 5;
    }
    if (moveDown) {
        player.hitBox.y += 5;
    }
    if (moveRight) {
        player.hitBox.x += 5;
    }
}
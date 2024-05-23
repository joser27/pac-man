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
            toBeVisited: false,
            value: matrix[i][j],
            parent: null,
            isPath: false,
        };
        row.push(tile);
    }
    tileMatrix.push(row);
}

const rows = matrix.length;
const cols = matrix[0].length;
const tileWidth = canvas.width / cols;
const tileHeight = canvas.height / rows;

const player = {
    x: 1*tileWidth,
    y: 1*tileHeight,
}

const zombie = {
    x: 11*tileWidth,
    y: 1*tileHeight,
}
let count = 0;
let custom = 2;
let backtrack = []
BFS(zombie,player)
//path(zombie)
function loop() {
    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
    // player draw
    c.fillStyle='red'
    c.fillRect(player.x, player.y, tileWidth, tileHeight);
    // zombie draw
    c.fillStyle='orange'
    c.fillRect(zombie.x, zombie.y, tileWidth, tileHeight);

    // Draw the matrix
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (matrix[y][x] === 1) {
                c.fillStyle = 'grey';
                c.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            } else if (matrix[y][x] === 0) {
                c.fillStyle = 'black';
                c.strokeRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
            
            //Print visited cells
            if (tileMatrix[y][x].visited) {
                c.fillStyle = 'rgba(0,0,100,0.3)';
                c.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
            //Print visited cells
            if (tileMatrix[y][x].toBeVisited) {
                c.fillStyle = 'rgba(100,0,00,0.3)';
                c.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
            // Draw path cells
            if (tileMatrix[y][x].isPath) {
                c.fillStyle = 'black'; // Choose a color for the path
                c.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
            // Print tile properties
            c.fillStyle = 'black';
            c.fillText(`P: ${tileMatrix[y][x].isPath}`, x * tileWidth, y * tileHeight + 10);
            c.fillText(`Val: ${tileMatrix[y][x].value}`, x * tileWidth, y * tileHeight + 20);
            c.fillText(`TBV: ${tileMatrix[y][x].toBeVisited}`, x * tileWidth, y * tileHeight + 30);
        
        }
    }

    for (let i = 0; i < backtrack.length; i++) {
        console.log("hi")
        let tile = backtrack[i];
        //console.log(tile)
        c.fillStyle = 'rgba(0,255,0,0.3)';
        c.fillRect(tile.x * squareWidth, tile.y * squareHeight, squareWidth, squareHeight);
    }
    window.requestAnimationFrame(loop);
}

loop();

function BFS(entity, target) {
    let visited = [];
    let toBeVisited = new Queue();
    let tile = tileMatrix[Math.floor(entity.y/tileHeight)][Math.floor(entity.x/tileWidth)];
    tileMatrix[Math.floor(entity.y/tileHeight)][Math.floor(entity.x/tileWidth)].toBeVisited=true;
    toBeVisited.enqueue(tile);
    
    while(count<90) {
        count++;
        tile = toBeVisited.dequeue();
        //tileMatrix[tile.y][tile.x].visited=true;
        //visited.push(tile)

        if (tile.x === target.x/tileWidth && tile.y === target.y/tileHeight) {
            console.log("Target found, starting backtracking...");
            backtrack = [];
            console.log(tile)
            while (tile.parent !== null) {

                backtrack.push(tile);
                tile = tile.parent;
            }
            break;
        }
        if (tile.y > 0 && tileMatrix[tile.y - 1][tile.x].value !== 1 && !tileMatrix[tile.y - 1][tile.x].visited && !tileMatrix[tile.y - 1][tile.x].toBeVisited) {
            console.log("u")
            toBeVisited.enqueue(tileMatrix[tile.y - 1][tile.x]);
            tileMatrix[tile.y - 1][tile.x].toBeVisited=true;
            tileMatrix[tile.y][tile.x].parent = tileMatrix[tile.y - 1][tile.x];
    
        }
        if (tile.y < rows - 1 && tileMatrix[tile.y + 1][tile.x].value !== 1 && !tileMatrix[tile.y + 1][tile.x].visited && !tileMatrix[tile.y + 1][tile.x].toBeVisited) {
            
            console.log("d")
            toBeVisited.enqueue(tileMatrix[tile.y + 1][tile.x])
            tileMatrix[tile.y + 1][tile.x].toBeVisited=true;
            tileMatrix[tile.y][tile.x].parent = tileMatrix[tile.y + 1][tile.x]
        }
        if (tile.x > 0 && tileMatrix[tile.y][tile.x - 1].value !== 1 && !tileMatrix[tile.y][tile.x - 1].visited && !tileMatrix[tile.y][tile.x - 1].toBeVisited) {
            
            console.log("l")
            toBeVisited.enqueue(tileMatrix[tile.y][tile.x - 1])
            tileMatrix[tile.y][tile.x - 1].toBeVisited=true;
            tileMatrix[tile.y][tile.x].parent = tileMatrix[tile.y][tile.x - 1]
        }
        if (tile.x < cols - 1 && tileMatrix[tile.y][tile.x + 1].value !== 1 && !tileMatrix[tile.y][tile.x + 1].visited && !tileMatrix[tile.y][tile.x + 1].toBeVisited) {
            
            console.log("r")
            toBeVisited.enqueue(tileMatrix[tile.y][tile.x + 1])
            tileMatrix[tile.y][tile.x + 1].toBeVisited=true
            tileMatrix[tile.y][tile.x].parent = tileMatrix[tile.y][tile.x + 1]
        }

    }
}

window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'p':
            custom++;;
            break

}})







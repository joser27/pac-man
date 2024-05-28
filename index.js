const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
// const matrix = [
//     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
//     [1,0,0,1,0,0,0,1,1,0,0,0,0,0,0,1],
//     [1,0,0,1,0,0,0,1,1,0,0,0,0,0,0,1],
//     [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
//     [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
//     [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
//     [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
//     [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
//     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
// ];

const matrix = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const rows = matrix.length;
const cols = matrix[0].length;
const squareWidth = canvas.width / cols;
const squareHeight = canvas.height / rows;

const player = {
    x: 10,
    y: 5,
}

const zombie = {
    x: 7,
    y: 2,
}

astar = new AStar();


function loop() {
    let pathing = astar.path(player,zombie);
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
            
                    // // Display gCost, fCost, and hCost as text
                    
                    // let currentNode = nodeMatrix[y][x];
                    // if (currentNode.gCost > 0) {
                    //     c.clearRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
                    //     c.fillStyle = 'red';
                    //     c.font = '12px Arial'; // Set font size and style
                    //     c.fillText(`g:${currentNode.gCost}`, x * squareWidth, y * squareHeight + 15); // Display gCost
                    //     c.fillText(`h:${currentNode.hCost}`, x * squareWidth + 35, y * squareHeight + 15); // Display fCost
                    //     c.font = '25px Arial'; 
                    //     c.fillText(`f:${currentNode.fCost}`, x * squareWidth + 1, y * squareHeight + 45); // Display hCost
                    // }
                    // if (this.closed.includes(currentNode)) {
                    //     c.fillStyle = 'rgba(255,0,0,0.5)';
                    //     c.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
                    // }
                    // if (this.open.includes(currentNode)) {
                    //     c.fillStyle = 'rgba(0,255,0,0.5)';
                    //     c.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
                    // }
        }
    }
    for (let i = 0; i < pathing.length; i++) {
        let tile = pathing[i];
        //console.log(tile)
        c.fillStyle = 'rgba(0,255,0,0.3)';
        c.fillRect(tile[0] * squareWidth, tile[1] * squareHeight, squareWidth, squareHeight);
    }
    window.requestAnimationFrame(loop);
}
loop();


window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'e':
            console.log("PATHING")
            pathing = astar.path(player,zombie);
            
            break

}})







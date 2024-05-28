class AStar {
    constructor() {
        this.open = [];
        this.closed = [];
        this.matrix = [];
    }
    createNodeMatrix(matrix) {
        let nodeMatrix = [];
        for (let i = 0; i < matrix.length; i++) {
            nodeMatrix[i] = [];
            for (let j = 0; j < matrix[i].length; j++) {
                let walkable = matrix[i][j] === 0;
                nodeMatrix[i][j] = new Node(j, i, walkable);

            }
        }
        return nodeMatrix;
    }
    path(start, end) { 
        this.open = [];
        this.closed = [];
        this.matrix = [];
        let nodeMatrix = this.createNodeMatrix(matrix);
        let startNode = nodeMatrix[start.y][start.x];
        let endNode = nodeMatrix[end.y][end.x];
        this.open.push(startNode);
        while(this.open.length > 0) {
            // Find the node with the lowest f-cost
            let lowestIndex = 0;
            console.log("Open list: ",this.open.length)
            for (let i = 0; i < this.open.length; i++) {
                if (this.open[i].fCost < this.open[lowestIndex].fCost) {
                    lowestIndex = i;
                }
            }
            let current = this.open[lowestIndex];
            this.open.splice(lowestIndex, 1);
            this.closed.push(current);
            
            if (current.x === endNode.x && current.y === endNode.y) {
                console.log("End node found! Path has been found.")
                let path = [];
                let temp = current;
                while(temp !== startNode) {
                    path.push([temp.x, temp.y]);
                    temp = temp.parent;

                    console.log(temp)
                }
                //console.log(path)
                return path.reverse();
            }

            let directions = [[0,-1],[0,1],[-1,0],[1,0],[1,-1],[1,1],[-1,1],[-1,-1]]
            directions.forEach(dir => {
                let x = current.x + dir[0];
                let y = current.y + dir[1];
            
                // Check if x and y are within the bounds of the matrix
                if (x >= 0 && x < nodeMatrix[0].length && y >= 0 && y < nodeMatrix.length) {
                    let neighbor = nodeMatrix[y][x];
                    if(neighbor.isWalkable && !this.closed.includes(neighbor)) {
                        // Calculate g cost
                        let dx = Math.abs(current.x - neighbor.x);
                        let dy = Math.abs(current.y - neighbor.y);
                        let newGCost;
                        
                        if (dx === 1 && dy === 0 || dx === 0 && dy === 1) {
                            // The direction is up, down, left, or right
                            newGCost = current.gCost + 10;
                        } else if (dx === 1 && dy === 1) {
                            // The direction is diagonal up right, up left, down right, or down left
                            newGCost = current.gCost + 14;
                        }
            
                        // If the neighbor is not in the open list or the new g cost is lower
                        if (!this.open.includes(neighbor) || newGCost < neighbor.gCost) {
                            // Update g cost, h cost, f cost, and parent
                            neighbor.gCost = newGCost;
                            // Calculate h cost, Manhattan distance
                            let hdx = Math.abs(neighbor.x - endNode.x);
                            let hdy = Math.abs(neighbor.y - endNode.y);
                            neighbor.hCost = 10 * (hdx + hdy); // 10 is the cost to move horizontally or vertically
                            // Calculate f cost
                            neighbor.fCost = neighbor.gCost + neighbor.hCost;
                            neighbor.parent = current;
                            if (!this.open.includes(neighbor)) {
                                this.open.push(neighbor);
                            }
                        }
                    }
                }
            });
        }
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
                    // Display gCost, fCost, and hCost as text
                    
                    let currentNode = nodeMatrix[y][x];
                    if (currentNode.gCost > 0) {
                        c.clearRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
                        c.fillStyle = 'red';
                        c.font = '12px Arial'; // Set font size and style
                        c.fillText(`g:${currentNode.gCost}`, x * squareWidth, y * squareHeight + 15); // Display gCost
                        c.fillText(`h:${currentNode.hCost}`, x * squareWidth + 35, y * squareHeight + 15); // Display fCost
                        c.font = '25px Arial'; 
                        c.fillText(`f:${currentNode.fCost}`, x * squareWidth + 1, y * squareHeight + 45); // Display hCost
                    }
                    if (this.closed.includes(currentNode)) {
                        c.fillStyle = 'rgba(255,0,0,0.5)';
                        c.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
                    }
                    if (this.open.includes(currentNode)) {
                        c.fillStyle = 'rgba(0,255,0,0.5)';
                        c.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
                    }
                    //player
                    c.font = '15px Arial'; // Set font size and style
                    c.fillText(`S:`, player.x * squareWidth + 15, player.y * squareHeight + 35); // Display gCost
                    //zombie
                    c.font = '15px Arial'; // Set font size and style
                    c.fillText(`E:`, zombie.x * squareWidth + 15, zombie.y * squareHeight + 35); // Display gCost
                }
            }
    }
}







          // // Draw the matrix
            // for (let y = 0; y < rows; y++) {
            //     for (let x = 0; x < cols; x++) {
            //         if (matrix[y][x] === 1) {
            //             c.fillStyle = 'grey';
            //             c.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            //         } else if (matrix[y][x] === 0) {
            //             c.fillStyle = 'black';
            //             c.strokeRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            //         }
            //         // Display gCost, fCost, and hCost as text
                    
            //         let currentNode = nodeMatrix[y][x];
            //         if (currentNode.gCost > 0) {
            //             c.clearRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            //             c.fillStyle = 'red';
            //             c.font = '12px Arial'; // Set font size and style
            //             c.fillText(`g:${currentNode.gCost}`, x * squareWidth, y * squareHeight + 15); // Display gCost
            //             c.fillText(`h:${currentNode.hCost}`, x * squareWidth + 35, y * squareHeight + 15); // Display fCost
            //             c.font = '25px Arial'; 
            //             c.fillText(`f:${currentNode.fCost}`, x * squareWidth + 1, y * squareHeight + 45); // Display hCost
            //         }
            //         if (this.closed.includes(currentNode)) {
            //             c.fillStyle = 'rgba(255,0,0,0.5)';
            //             c.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            //         }
            //         if (this.open.includes(currentNode)) {
            //             c.fillStyle = 'rgba(0,255,0,0.5)';
            //             c.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            //         }
            //         //player
            //         c.font = '15px Arial'; // Set font size and style
            //         c.fillText(`S:`, player.x * squareWidth + 15, player.y * squareHeight + 35); // Display gCost
            //         //zombie
            //         c.font = '15px Arial'; // Set font size and style
            //         c.fillText(`E:`, zombie.x * squareWidth + 15, zombie.y * squareHeight + 35); // Display gCost
            //     }
            // }
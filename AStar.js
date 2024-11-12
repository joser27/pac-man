class AStar {
    constructor() {
        this.open = [];
        this.closed = [];
        this._nodeMatrix = []; // Use an underscore to indicate a private property
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

    path(start, end, gameMatrix) { 
        this.open = [];
        this.closed = [];
        this._nodeMatrix = this.createNodeMatrix(gameMatrix);
        let startNode = this._nodeMatrix[start.y][start.x];
        let endNode = this._nodeMatrix[end.y][end.x];
        this.open.push(startNode);
        
        while (this.open.length > 0) {
            let lowestIndex = 0;
            for (let i = 0; i < this.open.length; i++) {
                if (this.open[i].fCost < this.open[lowestIndex].fCost) {
                    lowestIndex = i;
                }
            }
            let current = this.open[lowestIndex];
            this.open.splice(lowestIndex, 1);
            this.closed.push(current);

            if (current.x === endNode.x && current.y === endNode.y) {
                let path = [];
                let temp = current;
                while (temp !== startNode) {
                    path.push([temp.x, temp.y]);
                    temp = temp.parent;
                }
                return path.reverse(); // Only return the path
            }

            let directions = [[0,-1],[0,1],[-1,0],[1,0],[1,-1],[1,1],[-1,1],[-1,-1]];
            directions.forEach(dir => {
                let x = current.x + dir[0];
                let y = current.y + dir[1];
                
                if (x >= 0 && x < this._nodeMatrix[0].length && y >= 0 && y < this._nodeMatrix.length) {
                    let neighbor = this._nodeMatrix[y][x];
                    if (neighbor.isWalkable && !this.closed.includes(neighbor)) {
                        let dx = Math.abs(current.x - neighbor.x);
                        let dy = Math.abs(current.y - neighbor.y);
                        let newGCost = (dx === 1 && dy === 0 || dx === 0 && dy === 1) ? current.gCost + 10 : current.gCost + 14;
                        
                        if (!this.open.includes(neighbor) || newGCost < neighbor.gCost) {
                            neighbor.gCost = newGCost;
                            let hdx = Math.abs(neighbor.x - endNode.x);
                            let hdy = Math.abs(neighbor.y - endNode.y);
                            neighbor.hCost = 10 * (hdx + hdy);
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
        return null; // no path is found
    }

    // Getter for nodeMatrix
    get nodeMatrix() {
        return this._nodeMatrix;
    }
}

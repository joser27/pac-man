class Node {
    constructor(x, y, walkable) {
        this.x = x;
        this.y = y;
        this.isWalkable = walkable;
        this.gCost = 0;
        this.hCost = 0;
        this.fCost = 0;
        this.parent = null;
    }
}
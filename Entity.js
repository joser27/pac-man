class Entity {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw(context, squareWidth, squareHeight) {
        context.fillStyle = this.color;
        context.fillRect(this.x * squareWidth, this.y * squareHeight, squareWidth, squareHeight);
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 'red');
    }
}

class Zombie extends Entity {
    constructor(x, y) {
        super(x, y, 'orange');
    }
}

class Zombie {
    constructor(x,y,width,height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hitBox = new Rectangle(this.x,this.y,this.width,this.height);
    }
}
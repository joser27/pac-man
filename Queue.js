class Queue {
    constructor() {
        this.items = [];
    }

    // Enqueue function
    enqueue(element) {
        this.items.push(element);
    }

    // Dequeue function
    dequeue() {
        if(this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    // Front function
    front() {
        if(this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }

    // isEmpty function
    isEmpty() {
        return this.items.length == 0;
    }

    // printQueue function
    printQueue() {
        let str = "";
        for(let i = 0; i < this.items.length; i++)
            str += JSON.stringify(this.items[i]) + " ";
        return str;
    }
}

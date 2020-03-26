class Queue {
    constructor(){
        this.q = [];
    }

    getData(){
        return this.q;
    }

    push(element){
        this.q.push(element);
    }

    isEmpty(){
        return this.q.length === 0;
    }

    pop(){
        if (this.isEmpty())
            new Error("Can't pop empty stack");
        return this.q.pop();
    }

    peek(){
        return this.q[this.q.length-1];
    }

    contains(e){
        for(let i =0;i<this.q.length;i++)
            if(JSON.stringify(this.q[i]) === JSON.stringify(e))
                return true;
        return false;
    }
}

module.exports = Queue;
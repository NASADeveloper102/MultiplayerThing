class Player{
    constructor(name, position, color){
        this.name = name;
        this.position = position;
        this.color = color;
    }
    Render(){
        push();
        fill(this.color);
        square(this.position.x, this.position.y, 50);
        pop();
    }
}

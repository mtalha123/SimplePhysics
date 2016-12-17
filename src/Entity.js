//Entity class represents a single entity in the simulation. 

define([], function(){
    
    function Entity(id){
        this.id = id;
        this.type = "circle";
        this.xPos = 0;
        this.yPos = 0;
        this.velocity = undefined;
        this.mass = undefined;
        this.radius = undefined;
        this.positionVector = undefined;
    }
    
    //each time updatePosition called, the positions will be incremented by the velocity to attain new position
    Entity.prototype.updatePosition = function(timestep, gravity){
        this.velocity.set(this.velocity.getX(), this.velocity.getY() + gravity);
        this.xPos += this.velocity.getX() * timestep;
        this.yPos += this.velocity.getY() * timestep;
    }
    
    return Entity;
});
//demo accessing the library using a browser global

var body = document.getElementsByTagName("body");

body[0].style.width = screen.availWidth + "px";

var canvas = document.getElementById("canvas");

var canvasWidth = canvas.width = window.innerWidth;
var canvasHeight = canvas.height = window.innerHeight;

var context = canvas.getContext("2d");

var currentCircleInControl = null;

function Circle(color, physicsEntity){
    this.color = color;
    this.physicsEntity = physicsEntity;
}

Circle.prototype.draw = function(context){
    context.save();
    
    context.fillStyle = this.color;
    
    context.beginPath();
    context.arc(this.physicsEntity.xPos, this.physicsEntity.yPos, this.physicsEntity.radius, 0, 2 * Math.PI, false);
    context.fill();
    
    context.restore();
}

var currentData = [];

//entities to be in the simulation
var circles = [];

//initialize a "PhysicsWorld" which will hold the simulation
var physicsWorld = new SimplePhysics.PhysicsWorld(0, 0, canvasWidth, canvasHeight);

//set the gravity in simulation
physicsWorld.setGravity(4);

var currentColor = "#D51312";

//create entities with random initial positions and velocities
for(var i = 0; i < 5; i++){
    circles[i] = new Circle(currentColor, physicsWorld.requestEntity());
    circles[i].physicsEntity.xPos = Math.floor((Math.random() * 800) + 100);
    circles[i].physicsEntity.yPos = Math.floor((Math.random() * 600) + 100);
    circles[i].physicsEntity.radius = 40;
    circles[i].physicsEntity.velocity = new SimplePhysics.Util.Vector2D(Math.floor((Math.random() * 100) + 30), Math.floor((Math.random() * 100) + 30));
    circles[i].physicsEntity.mass = 40;
    
    //spawn the entity which will make it a part of the simulation
    physicsWorld.spawnEntity(circles[i].physicsEntity);
}

//this function will be called repeatedly, setting up an animation loop
function runSimulation(){
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    //update the physics world
    physicsWorld.update();

    for(var a = 0; a < circles.length; a++){
        circles[a].draw(context);
    }

    //allows for the function to be constantly called as soon as the window is ready to be drawn into
    window.requestAnimationFrame(runSimulation);
}

//call the function to start the loop
runSimulation();


$("#colorpicker").spectrum({
    flat: true,
    showButtons: false,
    
    move: function(color){
        currentColor = color.toHexString();
    }
});

$("#addcircle").on("click", function(event){
    currentData = $("form").serializeArray();
    createPhysicsEntity();
});

$("#setgravity").on("click", function(event){
    physicsWorld.setGravity(parseInt($("#gravity").val()));
});

$("#canvas").on("mousedown", function(event){
    detectMouseControl(event.clientX, event.clientY);
});

$("#canvas").on("mouseup", function(event){
    if(currentCircleInControl){
        currentCircleInControl.controlled = false;
        currentCircleInControl = null;
    }
});

$("#canvas").on("mousemove", function(event){
    if(currentCircleInControl){
        currentCircleInControl.xPos = event.clientX;
        currentCircleInControl.yPos = event.clientY;
    }
});

function createPhysicsEntity(){
        var newCircle = new Circle(currentColor, physicsWorld.requestEntity());
        circles.push(newCircle);
    
        circles[circles.length - 1].physicsEntity.xPos = parseInt(currentData[0].value);
        circles[circles.length - 1].physicsEntity.yPos = parseInt(currentData[1].value);
        circles[circles.length - 1].physicsEntity.radius = parseInt(currentData[2].value);
        circles[circles.length - 1].physicsEntity.velocity = new SimplePhysics.Util.Vector2D(Math.floor((Math.random() * 100) + 30), Math.floor((Math.random() * 100) + 30));
        circles[circles.length - 1].physicsEntity.mass = parseInt(currentData[3].value);
        
        physicsWorld.spawnEntity(circles[circles.length - 1].physicsEntity);
}

function detectMouseControl(x, y){
    for(var i = 0; i < circles.length; i++){
        if(Math.sqrt( Math.pow(x - circles[i].physicsEntity.xPos, 2) + Math.pow(y - circles[i].physicsEntity.yPos, 2)) <= circles[i].physicsEntity.radius){
            currentCircleInControl = circles[i].physicsEntity; 
            currentCircleInControl.controlled = true;
            console.log("TESTTTTTT " + currentCircleInControl.controlled);
        }
    }
}

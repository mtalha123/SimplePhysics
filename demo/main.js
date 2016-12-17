//demo accessing the library using a browser global

var body = document.getElementsByTagName("body");

body[0].style.width = screen.availWidth + "px";

var canvas = document.getElementById("canvas");

var canvasWidth = canvas.width = window.innerWidth;
var canvasHeight = canvas.height = window.innerHeight;

var context = canvas.getContext("2d");

//entities to be in the simulation
var testEntities = [];

//initialize a "PhysicsWorld" which will hold the simulation
var physicsWorld = new SimplePhysics.PhysicsWorld(0, 0, canvasWidth, canvasHeight);

//set the gravity in simulation
physicsWorld.setGravity(4);

//create entities with random initial positions and velocities
for(var i = 0; i < 15; i++){
    testEntities[i] = physicsWorld.requestEntity();
    testEntities[i].xPos = Math.floor((Math.random() * 800) + 100);
    testEntities[i].yPos = Math.floor((Math.random() * 600) + 100);
    testEntities[i].radius = 40;
    testEntities[i].velocity = new SimplePhysics.Util.Vector2D(Math.floor((Math.random() * 100) + 30), Math.floor((Math.random() * 100) + 30));
    testEntities[i].mass = 40;
    
    //spawn the entity which will make it a part of the simulation
    physicsWorld.spawnEntity(testEntities[i]);
}

//this function will be called repeatedly, setting up an animation loop
function runSimulation(){
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    //update the physics world
    physicsWorld.update();

    context.fillStyle = "green";
    for(var a = 0; a < testEntities.length; a++){
        context.beginPath();
        context.arc(testEntities[a].xPos, testEntities[a].yPos, testEntities[a].radius, 0, 2 * Math.PI, false);
        context.fill();
    }

    //allows for the function to be constantly called as soon as the window is ready to be drawn into
    window.requestAnimationFrame(runSimulation);
}

//call the function to start the loop
runSimulation();

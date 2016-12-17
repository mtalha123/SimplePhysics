//Represents a simulation

define(['Entity', 'EventSystem', 'CollisionDetection', 'CollisionResponse'], function(Entity, EventSystem, CollisionDetection, CollisionResponse){
    var gravity = 4;
    var allEntities = [];
    //default timestep
    var timestep = 1/60;
    //used to assign an id to an entity when client requests one
    var entityIds = 0;
    
    //when a PhysicsWorld constructor is called, the boundaries must be defined. The simulation will run in this boundary.
    function PhysicsWorld(leftBoundary, topBoundary, rightBoundary, bottomBoundary){
        var left, top, right, bottom;
        
        //if no boundaries are specified, default values are used
        if(!leftBoundary){
            left = 0;
        }else{
            left = leftBoundary;
        }
        
        if(!topBoundary){
            top = 0;
        }else{
            top = topBoundary;
        }
        
        if(!rightBoundary){
            right = 1280;
        }else{
            right = rightBoundary;
        }
        
        if(!bottomBoundary){
            bottom = 720;
        }else{
            bottom = bottomBoundary;
        }
        
        CollisionDetection.setBoundaries(left, top, right, bottom);
    }
    
    //client can request an entity
    PhysicsWorld.prototype.requestEntity = function(){
        entityIds++;
        return new Entity(entityIds);
    }
    
    //client can spawn an entity that was requested
    PhysicsWorld.prototype.spawnEntity = function(entity){
        allEntities.push(entity);
        EventSystem.publishEvent("entity_spawned", {entity: entity});
    }
    
    //updates the simulation by checking for collision and updating all the entities' positions
    PhysicsWorld.prototype.update = function(){
        CollisionDetection.checkForCollisions();
        
        for(var i = 0; i < allEntities.length; i++){
            allEntities[i].updatePosition(timestep, gravity);
        }
    }
    
    PhysicsWorld.prototype.setTimestep = function(newTimestep){
        timestep = newTimestep;
    }
    
    PhysicsWorld.prototype.setGravity = function(newGravity){
        gravity = newGravity;
    }
    
    PhysicsWorld.prototype.destroyEntity = function(entity){
        for(var i = 0; i < allEntities.length; i++){
            if (entity.id === allEntities[i].id){
                allEntities.splice(i, 1);
                EventSystem.publishEvent("entity_destroyed", {entity: entity});
                return;
            }
        }
    }
    
    return PhysicsWorld;
});
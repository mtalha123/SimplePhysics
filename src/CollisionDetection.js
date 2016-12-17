define(['EventSystem'], function(EventSystem){
    var allEntitiesInSimulation = [];
    
    //when the following events happen, this module will be notified via the "recieveEvent" function callback
    EventSystem.register(recieveEvent, "entity_spawned");
    EventSystem.register(recieveEvent, "entity_destroyed");
    
    var leftBoundary, rightBoundary, topBoundary, bottomBoundary;
    
    function checkForCollisions(){
        //bottom two for loops checks for collision for all entities
        for (var i = 0; i < (allEntitiesInSimulation.length); i++){
            for(var a = i + 1; a < allEntitiesInSimulation.length; a++){
                //calculate distance between the centers of the two circles
                var distanceBetweenCenters = Math.sqrt(Math.pow((allEntitiesInSimulation[i].xPos - allEntitiesInSimulation[a].xPos), 2) + Math.pow((allEntitiesInSimulation[i].yPos - allEntitiesInSimulation[a].yPos), 2)); 
                
                //check to see if circles are intersecting
                if( (allEntitiesInSimulation[i].radius + allEntitiesInSimulation[a].radius) > distanceBetweenCenters){
                    //if so, calculate the amount of intersection (penetrationDepth) and publish the event to the EventSystem 
                    var penetrationDepth = (allEntitiesInSimulation[i].radius + allEntitiesInSimulation[a].radius) - distanceBetweenCenters;
                    EventSystem.publishEvent("entity_collision", {entity1: allEntitiesInSimulation[i], entity2: allEntitiesInSimulation[a], penetrationDepth: penetrationDepth});
                }
            }
            
            //checks collision of entities against left boundary
            if((allEntitiesInSimulation[i].xPos - allEntitiesInSimulation[i].radius) < leftBoundary){
                var penetrationDepth = leftBoundary - (allEntitiesInSimulation[i].xPos - allEntitiesInSimulation[i].radius);
                EventSystem.publishEvent("boundary_collision", {entity: allEntitiesInSimulation[i], boundary: "left", penetrationDepth: penetrationDepth});
            }
            
            //checks collision of entities against right boundary
            if((allEntitiesInSimulation[i].xPos + allEntitiesInSimulation[i].radius) > rightBoundary){
                var penetrationDepth = (allEntitiesInSimulation[i].xPos + allEntitiesInSimulation[i].radius) - rightBoundary;
                EventSystem.publishEvent("boundary_collision", {entity: allEntitiesInSimulation[i], boundary: "right", penetrationDepth: penetrationDepth});
            }
            
            //checks collision of entities against top boundary
            if((allEntitiesInSimulation[i].yPos - allEntitiesInSimulation[i].radius) < topBoundary){
                var penetrationDepth = topBoundary - (allEntitiesInSimulation[i].yPos - allEntitiesInSimulation[i].radius);
                EventSystem.publishEvent("boundary_collision", {entity: allEntitiesInSimulation[i], boundary: "top", penetrationDepth: penetrationDepth});
            }
            
            //checks collision of entities against bottom boundary
            if((allEntitiesInSimulation[i].yPos + allEntitiesInSimulation[i].radius) > bottomBoundary){
                var penetrationDepth = (allEntitiesInSimulation[i].yPos + allEntitiesInSimulation[i].radius) - bottomBoundary;
                EventSystem.publishEvent("boundary_collision", {entity: allEntitiesInSimulation[i], boundary: "bottom", penetrationDepth: penetrationDepth});
            }
        }
    }
    
    function recieveEvent(eventInfo){
        if(eventInfo.eventType === "entity_spawned"){
            allEntitiesInSimulation.push(eventInfo.eventData.entity);   
        }else{
            //if entity destroyed, remove it from array
            for(var i = 0; i < allEntitiesInSimulation.length; i++){
                if(allEntitiesInSimulation[i].id === eventInfo.eventData.entity.id){
                    allEntitiesInSimulation.splice(i, 1);
                    return;
                }
            }
        }
    }
    
    //these are the boundaries in which simulation will run
    function setBoundaries(startX, startY, endX, endY){
        leftBoundary = startX;
        rightBoundary = endX;
        topBoundary = startY;
        bottomBoundary = endY;
    }
    
    return {
        checkForCollisions: checkForCollisions,
        setBoundaries: setBoundaries
    }
});
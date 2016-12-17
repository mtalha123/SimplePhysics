define(['EventSystem', 'Vector2D'], function(EventSystem, Vector2D){
    EventSystem.register(receiveCollisionEvent, "entity_collision");
    EventSystem.register(receiveCollisionEvent, "boundary_collision");
    
    function receiveCollisionEvent(eventInfo){
        if(eventInfo.eventType === "entity_collision"){
            var entity1 = eventInfo.eventData.entity1;
            var entity2 = eventInfo.eventData.entity2;

            var entity1InitialVelocity = entity1.velocity;
            var entity2InitialVelocity = entity2.velocity;
            //calculate the collision normal vector which is vector normal to collision running through the centers of two circles
            var collisionNormalUnitVector = new Vector2D(entity2.xPos - entity1.xPos, entity2.yPos - entity1.yPos);
            //normalize the vector to make into unit vector (only direction is needed)
            collisionNormalUnitVector.normalize();
            //the tangent unit vector to the collision normal
            var collisionTangentUnitVector = new Vector2D((-1) * collisionNormalUnitVector.getY(), collisionNormalUnitVector.getX())

            //these three lines apply an impulse to the entity 2 in order to stop the collision detection (make entities stop intersecting)
            var pentrationVector = collisionNormalUnitVector.multiplyByScalar(eventInfo.eventData.penetrationDepth);
            entity2.xPos += pentrationVector.getX();
            entity2.yPos += pentrationVector.getY();

            //initial velocity along the collision normal for entity 1
            var entity1InitialVelocityAlongCN = entity1InitialVelocity.projectOnto(collisionNormalUnitVector);
            //the velocity of entity 1 perpendiculr to collision normal. Note that this velocity will not change during the collision.
            var entity1VelocityPerpendicularToCollisionNormal = entity1InitialVelocity.projectOnto(collisionTangentUnitVector);

            //initial velocity along the collision normal for entity 2
            var entity2InitialVelocityAlongCollisionNormal = entity2InitialVelocity.projectOnto(collisionNormalUnitVector);
            //the velocity of entity 2 perpendiculr to collision normal. Note that this velocity will not change during the collision.
            var entity2VelocityPerpendicularToCollisionNormal = entity2InitialVelocity.projectOnto(collisionTangentUnitVector);;

            //conservation of momentum applied to the velocities along the collision normal to obtain final velocity along this axis for entity 1
            var entity1FinalVelocityAlongCollisionNormal = entity1InitialVelocityAlongCN.multiplyByScalar((entity1.mass - entity2.mass) / (entity1.mass + entity2.mass)).
                                                           addWith(entity2InitialVelocityAlongCollisionNormal.multiplyByScalar((2 * entity2.mass) / (entity1.mass + entity2.mass))); 
            
            //conservation of momentum applied to the velocities along the collision normal to obtain final velocity along this axis for entity 2
            var entity2FinalVelocityAlongCollisionNormal = entity2InitialVelocityAlongCollisionNormal.multiplyByScalar((entity2.mass - entity1.mass) / (entity1.mass + entity2.mass)).
                                                           addWith(entity1InitialVelocityAlongCN.multiplyByScalar((2 * entity1.mass) / (entity1.mass + entity2.mass))); 
            
            //To get final velocity vectors in the regular x-y plane, add the velocity vectors perpendicular to collision normal with final velocities calculated above
            entity1.velocity = entity1FinalVelocityAlongCollisionNormal.addWith(entity1VelocityPerpendicularToCollisionNormal);
            entity2.velocity = entity2FinalVelocityAlongCollisionNormal.addWith(entity2VelocityPerpendicularToCollisionNormal);
        }else {
            //check to see which boundary and reverse the components of the velocity accordingly
            switch(eventInfo.eventData.boundary){
                case "left":
                    eventInfo.eventData.entity.xPos += eventInfo.eventData.penetrationDepth;
                    eventInfo.eventData.entity.velocity.set(eventInfo.eventData.entity.velocity.getX() * -1, eventInfo.eventData.entity.velocity.getY());
                    break;
                case "right":
                    eventInfo.eventData.entity.xPos -= eventInfo.eventData.penetrationDepth;
                    eventInfo.eventData.entity.velocity.set(eventInfo.eventData.entity.velocity.getX() * -1, eventInfo.eventData.entity.velocity.getY());
                    break;
                case "top":
                    eventInfo.eventData.entity.yPos += eventInfo.eventData.penetrationDepth;
                    eventInfo.eventData.entity.velocity.set(eventInfo.eventData.entity.velocity.getX(), eventInfo.eventData.entity.velocity.getY() * -1);
                    break;
                case "bottom":
                    eventInfo.eventData.entity.yPos -= eventInfo.eventData.penetrationDepth;
                    eventInfo.eventData.entity.velocity.set(eventInfo.eventData.entity.velocity.getX(), eventInfo.eventData.entity.velocity.getY() * -1);
                    break;
                    
            }
        }
        
    }
});
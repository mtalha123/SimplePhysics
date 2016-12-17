// EventSystem module is similar to the publisher-subscriber design pattern, with a lot of added flexibility.

define([], function(){
    
    var currentEventsQueue = [];
    
    //different modules/objects can subcribe to various events
    var subscribers = {
        entity_collision: [],
        boundary_collision: [],
        entity_spawned: [],
        entity_destroyed: []
    };
    
    //register for a specific event and then be notified when that event fires
    function register(callback, eventType, object ){
        for(var key in subscribers){
            if(eventType === key){
                if(object != undefined){
                    subscribers[key].push(object);
                }
                subscribers[key].push(callback);
            } 
        }
    }
    
    //modules/objects can publish events which will then be sent to all objects subscribed to the event
    function publishEvent(eventType, eventData){
        var eventType = eventType;
        var eventData = eventData;
   
        for(var i = 0; i < subscribers[eventType].length; i++){
            if(typeof subscribers[eventType][i] === "function"){
                if(typeof subscribers[eventType][i-1] === "object"){
                    subscribers[eventType][i].call(subscribers[eventType][i-1], {eventType: eventType, eventData: eventData});
                }else{
                    subscribers[eventType][i]({eventType: eventType, eventData: eventData});
                }
            }
        }
    }

    return {        
        register: register,
        publishEvent: publishEvent,
    }
});
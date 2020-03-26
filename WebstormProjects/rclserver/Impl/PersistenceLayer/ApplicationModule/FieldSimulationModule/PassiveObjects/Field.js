const Entity = require('./Entity');

class Field {

    constructor(){
        this.entities = {};
    }


    getFieldEntities(){
        let res = [];
        for(let entity in this.entities){
            res.push(this.getEntityState(entity))
        }
        return res;
    }

    addRCL(entity, AutomataFactory, acceptanceEvent, garbageEvent) {
        if (this.entities[entity] === undefined)
            this.entities[entity] = new Entity(entity, AutomataFactory.buildAutomata('RCL', acceptanceEvent, garbageEvent));
    }


    addBET(entity, AutomataFactory, acceptanceEvent, garbageEvent) {
        if (this.entities[entity] === undefined)
            this.entities[entity] = new Entity(entity, AutomataFactory.buildAutomata('BETV2', acceptanceEvent, garbageEvent));
    }

    addBCL(entity, AutomataFactory, acceptanceEvent, garbageEvent) {
        if (this.entities[entity] === undefined)
            this.entities[entity] = new Entity(entity, AutomataFactory.buildAutomata('BCL', acceptanceEvent, garbageEvent));
    }

    notifyEvent(event){

        let entity = event.entity;
        if (this.entities[entity] !== undefined) {
            this.entities[entity].notifyEvent(event);
        }
        else
            throw new Error("Unknown Entity " + event.toString());

    }

    getEntityState(entity){
        if (this.entities[entity] !== undefined){
            return this.entities[entity].getCurrentState();
        }

        throw new Error("Unknown Entity " + entity);
    }

    registerAllEntitiesListener(connectionHandler){
        for(let entity in this.entities){
            this.registerEntityListener(connectionHandler, entity);
        }
    }

    registerEntityListener(connectionHandler, entity){
        if (this.entities[entity] !== undefined){
            this.entities[entity].registerListener(connectionHandler);
        }

        throw new Error("Unknown Entity " + entity);
    }

}

module.exports = Field;
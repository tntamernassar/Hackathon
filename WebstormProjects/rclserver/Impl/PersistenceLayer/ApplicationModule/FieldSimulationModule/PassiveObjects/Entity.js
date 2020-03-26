class Entity {

    constructor(name, Automata){
        this.name = name;
        this.Automata = Automata;
        this.listeners = [];
    }


    notifyEvent(event){
        let old_state = this.getCurrentAutomataState();
        this.Automata.apply(event);
        let new_state = this.getCurrentAutomataState();
        if(old_state.getName() !== new_state.getName())
            this.notifyStateChanged();
    }

    getCurrentAutomataState(){
        return this.Automata.getCurrentState();
    }

    getCurrentState(){
        return this.getState();
    }

    registerListener(connectionHandler){
        this.listeners.push(connectionHandler);
    }

    notifyStateChanged(){
        this.listeners = this.listeners.filter((connectionHandler)=>connectionHandler.isAlive());
        this.listeners.map((connectionHandler)=>connectionHandler.sendMessage('EL ' + this.getState()));
    }

    getState(){
        return JSON.stringify({
            name:this.name,
            automataLastPathElement:this.Automata.getLastElementInPath().getJSONState()
        });
    }
}


module.exports = Entity;
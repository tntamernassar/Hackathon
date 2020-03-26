const State = require('./State');
const Queue = require('../Queue');

class PDAutomata{
    constructor(initialState){
        this.ruleId = 0;
        this.curr = new State(initialState);
        this.states = [this.curr];
        this.queue = new Queue();
        this.init = this.curr;
        this.onError = undefined;

        let p1 = new PathStep('undefined', this.curr, new Date());
        this.path = [p1];
    }

    getState(name){
        let sourceState = this.states.filter((state)=>state.getName() === name);

        if(sourceState.length > 1)
            new Error('duplicated states');
        else if(sourceState.length === 0)
            return undefined;
        else
            return sourceState[0];

    }

    getPath(){
        return this.path;
    }

    getLastElementInPath(){
        return this.getPath()[this.getPath().length-1]
    }

    getCurrentState(){
        return this.curr;
    }

    setAcceptanceState(state, AcceptanceEvent){
        let s = this.getState(state);
        if (s === undefined)
            new Error('unknown state '+ state);

        s.setAsAcceptance(AcceptanceEvent);
        return this;
    }

    setErrorListener(onError){
        this.onError = onError;
    }

    addRule(from, to, constrain){
        let sourceState = this.getState(from);

        if (sourceState === undefined) {
            sourceState = new State(from);
            this.states.push(sourceState);
        }

        let destState = this.getState(to);

        if (destState === undefined) {
            destState = new State(to);
            this.states.push(destState);

        }

        sourceState.addPredicate(this.ruleId ++,constrain, destState);

        return this;
    }

    apply(event){
        let oldState = this.curr;

        this.curr === undefined ? new Error('No initial state declared'):
            this.curr = this.curr.apply(event, this.queue);

        let newState = this.curr;

        if(newState === undefined)
            if (this.onError !== undefined)
                this.onError(this);
            else
                throw new Error(oldState.getName() + " : Can't find predicate to handle event : " + JSON.stringify(event));

        //check for state changes
        if(oldState.getName() !== newState.getName()){
            let now = new Date();
            let enteringStep = new PathStep(event, newState, now);
            this.path.push(enteringStep);
        }

        if (newState.acceptance && newState.acceptanceEvent !== undefined){
            newState.acceptanceEvent(this);
        }

        return this;
    }

    applyAll(word){
        word.map((w)=>this.apply(w));
    }

    restart(){
        this.queue = new Queue();
        this.curr = this.init;

        let p1 = new PathStep('undefined', this.curr, new Date());
        this.path = [p1];
    }
}

class PathStep{
    constructor(triggerEvent, state, time){
        this.triggerEvent = triggerEvent;
        this.state = state;
        this.time = time;
    }

    getTriggerEvent(){
        return this.triggerEvent;
    }

    getState(){
        return this.state;
    }

    getTime(){
        return this.time;
    }

    getTriggerTime(){
        return this.getTriggerEvent().txn_date;
    }

    getTriggerEntity(){
        return this.getTriggerEvent().entity;
    }


    getJSONState(){
        return JSON.stringify({
            state:this.getState().getName(),
            time:this.getTime(),
            triggerEvent:JSON.stringify(this.getTriggerEvent())
        });
    }

}


module.exports = PDAutomata;
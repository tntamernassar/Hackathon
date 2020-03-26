class State{
    constructor(name){
        this.name = name;
        this.predecates = {};
        this.acceptance = false;
        this.acceptanceEvent = undefined;
    }

    addPredicate(RuleId, predicate, destState){
        this.predecates[RuleId] = [predicate, destState];
    }

    setAsAcceptance(acceptanceEvent){
        this.acceptance = true;
        this.acceptanceEvent = acceptanceEvent;
    }

    apply(event, queue){

        for (let RuleId in this.predecates) {
            let predFunction = this.predecates[RuleId][0];

            if (predFunction(event, queue)) {
                return this.predecates[RuleId][1];
            }
        }

        return undefined;
    }

    getName(){
        return this.name;
    }

}

module.exports = State;
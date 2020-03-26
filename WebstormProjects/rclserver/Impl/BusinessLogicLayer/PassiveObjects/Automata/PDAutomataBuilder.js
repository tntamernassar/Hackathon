const PDA = require('./PDAutomata');


class PDAutomataBuilder{
    static makePDAutomata(initialState){
        return new PDA(initialState);
    }

    /**
     * Extra Automata-related Builder functions
     * **/
}



module.exports = PDAutomataBuilder;
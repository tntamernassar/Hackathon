const PDABuilder = require('./PDAutomataBuilder');


const c0 = (e, q)=>{
    if(e === 'a' && q.peek() === '$'){
        q.push('a');
        return true;
    }

    return false;
};
const c1 = (e, q)=>{
    if(e === 'a' && q.peek() === 'a'){
        q.push('a');
        return true;
    }

    return false;
};
const c2 = (e, q)=>{
    if(e === 'b' && q.peek() === 'a'){
        q.pop();
        return true;
    }

    return false;
};
const c3 = (e, q)=>{
    if(e === 'b' && q.peek() === 'a'){
        q.pop();
        return true;
    }

    return false;
};
const c4 = (e, q)=>{
    if(e === '~' && q.peek() === 'a'){
        return true;
    }

    return false;
};
const c5 = (e, q)=>{
    if(e === '~' && q.peek() === '$'){
        return true;
    }

    return false;
};

let aNbN_PDA = PDABuilder.makePDAutomata('q0')
                .addRule('q0','q0', c0) //C0
                .addRule('q0','q0', c1) //C1
                .addRule('q0','q1', c2) //C2
                .addRule('q1','q1', c3) //C3
                .addRule('q1','q2', c4) //C4
                .addRule('q1','q2', c5); //C5





const test = (automata, word, shouldAccept)=>{

    const runner = ()=>{
        let accepted = false;
        automata.setAcceptanceState('q1', (s, e, q)=>accepted = true);
        automata.applyAll(word.split(''));
        automata.restart();
        return accepted;
    };

    try{
        runner();
        return shouldAccept;
    }catch (e) {
        return !shouldAccept;
    }

};

console.log(test(aNbN_PDA,'ab~', true));
console.log(test(aNbN_PDA,'aaab~', true));
console.log(test(aNbN_PDA,'aaabb~', true));
console.log(test(aNbN_PDA,'aaabbb~', true));
console.log(test(aNbN_PDA,'aaabbbb~', false));
console.log(test(aNbN_PDA,'aaabbbbb~', false));
console.log(test(aNbN_PDA,'aaa', false));
console.log(test(aNbN_PDA,'b', false));
console.log(test(aNbN_PDA,'&', false));






const SQLConnectivity = require('../../../../DBAccess/SQLDatabase/SQLConnectivity');
const DateService = require('../../../../ServiceLayer/Services/DateService').getInstance();

const HandleBETAcceptance = (Automata)=>{
    console.log('Accepted with : ' + JSON.stringify(Automata.getCurrentState()));

    let states = [];
    let times = [];

    let path = Automata.getPath();
    let i = path.length - 1;

    let entity = '';

    while (["UTP", "Down-No-Pm"].indexOf(path[i].getState().getName()) === -1){
        let p = path[i];
        states.push(p.getState().getName());
        times.push(p.getTriggerTime());
        i = i - 1;
        entity = p.getTriggerEntity();
    }
    
    console.log(states);

    let pp_time = DateService.createDate(times[0]);
    let ep_time = DateService.createDate(times[times.length-1]);

    let g2g = DateService.dateDiff(pp_time, ep_time);

    let automon_usage = states.indexOf('REC-WA') !== -1;

    let FQ = states.indexOf('REC-No-FQ') === -1;



    console.log(g2g + ", " + automon_usage + ', ' + FQ);

    SQLConnectivity.getInstance().insert(
        'INSERT INTO PMs VALUES (?,?,?,?,?,?,?,?)',
        [times[times.length-1], entity, 1, 'CLN3', g2g.toString(),automon_usage.toString(), FQ.toString(), '-']
    );

    Automata.restart();
    console.log('_______________________________________________');
};

const HandleBETGarbage = (Automata)=>{

    console.log('Garbaged with : ' + JSON.stringify(Automata.getCurrentState()));

    let states = [];
    let times = [];

    let path = Automata.getPath();
    let i = path.length - 1;

    let entity = '';

    while (["UTP", "Down-No-Pm"].indexOf(path[i].getState().getName()) === -1){
        let p = path[i];
        states.push(p.getState().getName());
        times.push(p.getTriggerTime());
        i = i - 1;
        entity = p.getTriggerEntity();
    }

    console.log(states);
    Automata.restart();
};



const HandleBCLAcceptance = (Automata)=>{
    console.log('Accepted with : ' + JSON.stringify(Automata.getCurrentState()));

    let states = [];
    let times = [];

    let path = Automata.getPath();
    let i = path.length - 1;

    let entity = '';

    while (["UTP", "Down-No-Pm"].indexOf(path[i].getState().getName()) === -1){
        let p = path[i];
        states.push(p.getState().getName());
        times.push(p.getTriggerTime());
        i = i - 1;
        entity = p.getTriggerEntity();
    }

    console.log(states);

    let pp_time = DateService.createDate(times[0]);
    let ep_time = DateService.createDate(times[times.length-1]);

    let g2g = DateService.dateDiff(pp_time, ep_time);

    let automon_usage = states.indexOf('PM-WA') !== -1;

    let FQ = states.indexOf('PM-NO-FQ') === -1;



    console.log(g2g + ", " + automon_usage + ', ' + FQ);

    SQLConnectivity.getInstance().insert(
        'INSERT INTO PMs VALUES (?,?,?,?,?,?,?,?)',
        [times[times.length-1], entity, 1, 'CLN3', g2g.toString(),automon_usage.toString(), FQ.toString(), '-']
    );

    Automata.restart();
    console.log('_______________________________________________');
};

const HandleBCLGarbage = (Automata)=>{

    console.log('Garbaged with : ' + JSON.stringify(Automata.getCurrentState()));

    let states = [];
    let times = [];

    let path = Automata.getPath();
    let i = path.length - 1;

    let entity = '';

    while (["UTP", "Down-No-Pm"].indexOf(path[i].getState().getName()) === -1){
        let p = path[i];
        states.push(p.getState().getName());
        times.push(p.getTriggerTime());
        i = i - 1;
        entity = p.getTriggerEntity();
    }

    console.log(states);
    Automata.restart();
};



const HandleRCLAcceptance = (Automata)=>{
    console.log('Accepted with : ' + JSON.stringify(Automata.getCurrentState()));

    let states = [];
    let times = [];

    let path = Automata.getPath();
    let i = path.length - 1;

    let entity = '';

    while (["UTP", "Down-No-Pm"].indexOf(path[i].getState().getName()) === -1){
        let p = path[i];
        states.push(p.getState().getName());
        times.push(p.getTriggerTime());
        i = i - 1;
        entity = p.getTriggerEntity();
    }

    console.log(states);

    let pp_time = DateService.createDate(times[0]);
    let ep_time = DateService.createDate(times[times.length-1]);

    let g2g = DateService.dateDiff(pp_time, ep_time);

    let automon_usage = states.indexOf('PM-WA') !== -1;

    let FQ = states.indexOf('PM_NO_FQ') === -1;



    console.log(g2g + ", " + automon_usage + ', ' + FQ);

    SQLConnectivity.getInstance().insert(
        'INSERT INTO PMs VALUES (?,?,?,?,?,?,?,?)',
        [times[times.length-1], entity, 1, 'CLN3', g2g.toString(),automon_usage.toString(), FQ.toString(), '-']
    );

    Automata.restart();
    console.log('_______________________________________________');
};

const HandleRCLGarbage = (Automata)=>{

    console.log('Garbaged with : ' + JSON.stringify(Automata.getCurrentState()));

    let states = [];
    let times = [];

    let path = Automata.getPath();
    let i = path.length - 1;

    let entity = '';

    while (["UTP", "Down-No-Pm"].indexOf(path[i].getState().getName()) === -1){
        let p = path[i];
        states.push(p.getState().getName());
        times.push(p.getTriggerTime());
        i = i - 1;
        entity = p.getTriggerEntity();
    }

    console.log(states);
    Automata.restart();
};





exports.HandleBETAcceptance = HandleBETAcceptance;
exports.HandleBETGarbage = HandleBETGarbage;

exports.HandleBCLAcceptance = HandleBCLAcceptance;
exports.HandleBCLGarbage = HandleBCLGarbage;

exports.HandleRCLAcceptance = HandleRCLAcceptance;
exports.HandleRCLGarbage = HandleRCLGarbage;
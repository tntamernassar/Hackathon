const PDAFactory = require('../../Impl/PersistenceLayer/ApplicationModule/FieldSimulationModule/PassiveObjects/Automatas/AutomataFactory');


const BETAcceptanceEvent = (Automata)=>{
    console.log('Accepted with : ' + Automata.getCurrentState().getName());
    for(let i in Automata.getPath()){
        let p = Automata.getPath()[i];

        let time;

        if(p.getTriggerEvent() === undefined){
            time = "-";
        }else{
            time = p.getTriggerEvent().txn_date;
        }

        console.log(p.getState().getName() + " - " + time);
    }
};

let BET_PDA = PDAFactory.buildAutomata('BET', BETAcceptanceEvent);


let e1 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Up',
    state:'UpToProduction',
    comments:'',
    shift:2,
    event:'',
    checklist_name:''
};

let e2 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Down',
    state:'WaitingIntel',
    comments:'ETU and some bullshit',
    shift:2,
    event:'',
    checklist_name:''
};

let e3 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Down',
    state:'WaitingIntel',
    comments:'ETU and some bullshit',
    shift:2,
    event:'',
    checklist_name:''
};

let e4 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Down',
    state:'WaitingIntel',
    comments:'ETU and some bullshit',
    shift:2,
    event:'',
    checklist_name:''
};

let e5 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Down',
    state:'SchedQual',
    comments:'ETU and some bullshit',
    shift:3,
    event:'',
    checklist_name:'SubBETncClean3PM'
};

let e6 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Down',
    state:'SchedQual',
    comments:'ETU and some bullshit',
    shift:3,
    event:'',
    checklist_name:'SubBETncClean3PM'
};

let e7 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Down',
    state:'SchedQual',
    comments:'ETU and some bullshit',
    shift:3,
    event:'',
    checklist_name:'SubBETncClean3PM'
};

let e8 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Down',
    state:'SchedQual',
    comments:'ETU and some bullshit',
    shift:3,
    event:'EqpUnschWaitPart',
    checklist_name:'SubBETncClean3PM'
};

let e9 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Down',
    state:'InPM',
    comments:'ETU and some bullshit',
    shift:3,
    event:'EqpBeginPM',
    checklist_name:'SubBETncClean3PM'
};

let e10 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Down',
    state:'InPM',
    comments:'ETU and some bullshit',
    shift:3,
    event:'',
    checklist_name:'SubBETncClean3PM'
};

let e11 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Down',
    state:'InPM',
    comments:'ETU and some bullshit',
    shift:3,
    event:'EqpAutomonPPQStart',
    checklist_name:'SubBETncClean3PM'
};

let e12 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Down',
    state:'InPM',
    comments:'ETU and some bullshit',
    shift:3,
    event:'',
    checklist_name:'SubBETncClean3PM'
};

let e13 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Down',
    state:'InPM',
    comments:'ETU and some bullshit',
    shift:3,
    event:'',
    checklist_name:'SubBETncClean3PM'
};

let e14 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Down',
    state:'InPM',
    comments:'ETU and some bullshit',
    shift:3,
    event:'',
    checklist_name:'SubBETncClean3PM'
};

let e15 = {
    entity:'BET102_PM2',
    txn_date:'2020-03-01 14:48:24',
    availability:'Up',
    state:'UpToProduction',
    comments:'ETU and some bullshit',
    shift:3,
    event:'',
    checklist_name:''
};

function run(){
    BET_PDA.apply(e1);
    BET_PDA.apply(e2);
    BET_PDA.apply(e3)
    BET_PDA.apply(e4);
    BET_PDA.apply(e5);
    BET_PDA.apply(e6);
    BET_PDA.apply(e7);
    BET_PDA.apply(e8);
    BET_PDA.apply(e9);
    BET_PDA.apply(e10);
    BET_PDA.apply(e11);
    BET_PDA.apply(e12);
    BET_PDA.apply(e13);
    BET_PDA.apply(e14);
    BET_PDA.apply(e15);
}

run();

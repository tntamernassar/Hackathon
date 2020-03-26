const PDABuilder = require('../../../../../BusinessLogicLayer/PassiveObjects/Automata/PDAutomataBuilder');


const containsSomethingWith = (Queue, thing)=>{
    for(let i =0;i<Queue.q.length;i++)
        if(Queue.q[i][0].indexOf(thing) !== -1)
            return true;
    return false;
};


const isEvent = (e)=>e.type==='event';
const isAlarm = (e)=>e.type==='alarm';
const isRFC = (e)=>e.type==='rfc';


const up = (e, q)=>isEvent(e) && e.availability === 'Up';
const cho = (e, q)=>isEvent(e) && e.checklist_name.indexOf('RCL') !== -1 && e.checklist_name.indexOf('PM') !== -1;
const atm = (e, q)=> isEvent(e) && e.event.toLowerCase().indexOf('automon') !== -1;

const First_O_RFC = (e, q)=>isRFC(e) && e.test_name === '4RCFEDSAPS' && !containsSomethingWith(q, 'O2');
const First_FG_RFC = (e, q)=>isRFC(e) && e.test_name === '4RCFEFGPS' && !containsSomethingWith(q, 'FG');


//O2 Predicates
const O_F_RFC = (e, q)=>{
    if(First_O_RFC(e, q))
    {
        //effect
        q.push(['O2_SS', e.lot]);
        return true;
    }

    return false;
};

const O_RFC = (e, q)=> isRFC(e) && e.test_name === '4RCFEDSAPS' && !q.isEmpty() && q.contains(['O2_SS', e.lot]);

const O_NO_FQ = (e, q)=> isRFC(e) && e.test_name === '4RCFEDSAPS' && !q.isEmpty() && !q.contains(['O2_SS', e.lot]);


//FG Predicates
const FG_F_RFC = (e, q)=>{
    if(First_FG_RFC(e, q))
    {
        //effect
        q.push(['FG_SS', e.lot]);
        return true;
    }

    return false;
};

const FG_RFC = (e, q)=> isRFC(e) && e.test_name === '4RCFEFGPS' && !q.isEmpty() && q.contains(['FG_SS', e.lot]);

const FG_NO_FQ = (e, q)=> isRFC(e) && e.test_name === '4RCFEFGPS' && !q.isEmpty() && !q.contains(['FG_SS', e.lot]);


//Error predicate
const c0 = (e, q)=> up(e, q) && cho(e, q);

const c1 = (e, q)=>!up(e, q) && !cho(e, q);
const c2 = (e, q)=>up(e, q) && !cho(e, q);
const c3 = (e, q)=>!up(e, q) && cho(e, q);
const c4 = (e, q)=>!up(e, q) && !atm(e, q) && !First_O_RFC(e, q) && !First_FG_RFC(e, q);
const c5 = (e, q)=>!up(e, q) && !First_O_RFC(e, q) && !First_FG_RFC(e, q);
const c6 = (e, q)=>!up(e, q); //not up
const c7 = (e, q)=>O_RFC(e, q) || (!isRFC(e) &&!up(e, q));
const c8 = (e, q)=>FG_RFC(e, q) || (!isRFC(e) &&!up(e, q));

const c9 = (e, q)=>FG_NO_FQ(e, q) || O_NO_FQ(e, q);

const buildRCLAutomata = (acceptanceEvent, garbageEvent)=>PDABuilder.makePDAutomata('UTP')
    .addRule('UTP', 'UTP', up)
    .addRule('UTP', 'Down-No-Pm', c1)
    .addRule('Down-No-Pm', 'Down-No-Pm', c1)
    .addRule('Down-No-Pm', 'UTP', c2)
    .addRule('UTP', 'InPM', c3)
    .addRule('Down-No-Pm', 'InPM', c3)
    .addRule('InPM', 'InPM', c4)
    .addRule('InPM', 'PM-WA', atm)
    .addRule('PM-WA', 'PM-WA', c5)
    .addRule('InPM', 'O_SS', O_F_RFC)
    .addRule('InPM', 'FG_SS', FG_F_RFC)
    .addRule('PM-WA', 'O_SS', O_F_RFC)
    .addRule('PM-WA', 'FG_SS', FG_F_RFC)
    .addRule('O_SS', 'O_SS', c7)
    .addRule('O_SS', 'FG_SS', FG_F_RFC)
    .addRule('FG_SS', 'FG_SS', c8)
    .addRule('FG_SS', 'O_SS', O_F_RFC)
    .addRule('O_SS', 'PM_NO_FQ', c9)
    .addRule('FG_SS', 'PM_NO_FQ', c9)
    .addRule('PM_NO_FQ', 'PM_NO_FQ', c6)
    .addRule('FG_SS', 'EP', up)
    .addRule('O_SS', 'EP', up)
    .addRule('PM_NO_FQ', 'EP', up)
    //Garbage rules
    .addRule('InPM', 'G', up)
    .addRule('PM-WA', 'G', up)
    .setAcceptanceState('EP', acceptanceEvent)
    .setAcceptanceState('G', garbageEvent);

exports.buildRCLAutomata = buildRCLAutomata;
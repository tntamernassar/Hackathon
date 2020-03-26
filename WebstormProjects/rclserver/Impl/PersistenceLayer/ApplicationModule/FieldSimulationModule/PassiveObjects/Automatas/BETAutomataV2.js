const PDABuilder = require('../../../../../BusinessLogicLayer/PassiveObjects/Automata/PDAutomataBuilder');

const EQ_TRIGGER_ALARM_IDS = [1001790, 1000644, 1000761]; // chamber is open alarm

const LEAK_CHECKS_INDICATIONS_STRINGS = [
    "Shutoff valve can not be open due to Chamber Cover switch is off",
    "Chamber failed to pump to vacuum (20.0mtorr) within 30 seconds.  Check chamber leakback rate.",
    "AutoPM started ( with specefied alarm id)"
];

const checkLikelyIn = (str, array)=>{
    let flag = false;
    for(let i=0;i<array.length;i++){
        let a = array[i];
        if(str.indexOf(a.toString()) !== -1)
            flag = true;
    }

    return flag;
};

const isEvent = (e)=>e.type==='event';
const isAlarm = (e)=>e.type==='alarm';
const isRFC = (e)=>e.type==='rfc';


const isAutomonEvent = (e)=> isEvent(e) && e.event.toLowerCase().indexOf('automon') !== -1;

function hash(s) {
    for(let i = 0, h = 0; i < s.length; i++)
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return h;
}


const isLeakCheckIndication = (e)=> LEAK_CHECKS_INDICATIONS_STRINGS.filter(
    (s)=>hash(s.toLowerCase().replace(" ","")) === hash(e.alarm_text.toLowerCase().replace(" ",""))
).length > 0;


let up = (e, q)=>isEvent(e) && e.availability === 'Up';

let c1 = (e, q)=> (isEvent(e) && e.availability === 'Up' && e.checklist_name !== 'SubBETncClean3PM' && e.checklist_name !== 'SubBETcuClean3PM') || isAlarm(e) || isRFC(e);

let c2 = (e, q)=> (isEvent(e) && e.availability === 'Down' && e.checklist_name !== 'SubBETncClean3PM' && e.checklist_name !== 'SubBETcuClean3PM') || isAlarm(e) || isRFC(e);

let c3 = (e, q)=> isEvent(e) && (e.checklist_name === 'SubBETncClean3PM' || e.checklist_name === 'SubBETcuClean3PM');

let c4 = (e, q)=> isAlarm(e) && checkLikelyIn(e.alarm_id.toString(), EQ_TRIGGER_ALARM_IDS);
let c4_not = (e, q)=> !c4(e, q) && !up(e, q);

let c5 = (e, q)=> isAlarm(e) && isLeakCheckIndication(e);
let c5_not = (e, q)=> !c5(e, q) && !up(e, q) && !isRFC(e) && !isAutomonEvent(e);

let c6 = (e, q)=> isRFC(e);
let c6_not = (e, q)=> !c6(e, q) && !up(e, q);

let c7 = (e, q)=> isAutomonEvent(e);

let c8 = (e, q)=> isEvent(e) && e.availability === 'Up';
let c8_not = (e, q)=> !c8(e, q) && !up(e, q);

let c6_c7_not = (e, q)=> !(c6(e, q) || c7(e, q)) && !up(e, q);


const buildBETAutomata = (acceptanceEvent, garbageEvent)=>PDABuilder.makePDAutomata('UTP')
    .addRule('UTP', 'UTP', c1)
    .addRule('UTP', 'Down-No-Pm', c2)
    .addRule('Down-No-Pm', 'UTP', c1)
    .addRule('Down-No-Pm', 'Down-No-Pm', c2)
    .addRule('UTP', 'PP_CLN3', c3)
    .addRule('Down-No-Pm', 'PP_CLN3', c3)
    .addRule('PP_CLN3', 'PP_CLN3', c4_not)
    .addRule('PP_CLN3', 'EQ', c4)
    .addRule('EQ', 'EQ', c5_not)
    .addRule('EQ', 'REC', c5)
    .addRule('EQ', 'REC-WA', c7)
    .addRule('EQ', 'RFC1', c6) //MAKE SURE WITH ANTHONY !
    .addRule('REC', 'REC', c6_c7_not)
    .addRule('REC', 'RFC1', c6)
    .addRule('RFC1', 'RFC1', c6_not)
    .addRule('REC-WA', 'REC-WA', c6_not)
    .addRule('REC-WA', 'RFC1', c6)
    .addRule('RFC2', 'RFC2', c6_not)
    .addRule('RFC1', 'RFC2', c6)
    .addRule('RFC3', 'RFC3', c6_not)
    .addRule('RFC2', 'RFC3', c6)
    .addRule('RFC3', 'REC-No-FQ', c6)
    .addRule('REC-No-FQ', 'REC-No-FQ', c8_not)
    .addRule('REC', 'REC-WA', c7)
    .addRule('RFC3', 'EP', c8)
    .addRule('REC-No-FQ', 'EP', c8)
    //add garbage rules
    .addRule('PP_CLN3', 'G', up)
    .addRule('EQ', 'G', up)
    .addRule('REC', 'G', up)
    .addRule('REC-WA', 'G', up)
    .addRule('RFC1', 'EP', up)
    .addRule('RFC2', 'EP', up)
    .setAcceptanceState('EP', acceptanceEvent)
    .setAcceptanceState('G', garbageEvent);

exports.buildBETAutomata = buildBETAutomata;
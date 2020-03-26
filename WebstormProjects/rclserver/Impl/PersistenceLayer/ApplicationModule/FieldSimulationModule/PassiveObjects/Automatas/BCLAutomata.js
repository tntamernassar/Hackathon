const PDABuilder = require('../../../../../BusinessLogicLayer/PassiveObjects/Automata/PDAutomataBuilder');



const isEvent = (e)=>e.type==='event';
const isAlarm = (e)=>e.type==='alarm';
const isRFC = (e)=>e.type==='rfc';


const up = (e, q)=>isEvent(e) && e.availability === 'Up';
const cho = (e, q)=>isEvent(e) && e.checklist_name.toLowerCase().indexOf("sub") !== -1 && e.checklist_name.toLowerCase().indexOf("bcl") && (e.checklist_name.toLowerCase().indexOf("cln") !== -1 || e.checklist_name.toLowerCase().indexOf("clean") !== -1);
const rfc = (e, q)=> isRFC(e);
const atm = (e, q)=> isEvent(e) && e.event.toLowerCase().indexOf('automon') !== -1;

const c0 = (e, q)=> up(e, q) && cho(e, q);
const c1 = (e, q)=> up(e, q) && !cho(e, q);
const c2 = (e, q)=> !up(e, q) && !cho(e, q);
const c3 = (e, q)=> !up(e, q) && cho(e, q);
const c4 = (e, q)=> !up(e, q) && !rfc(e, q);
const c5 = (e, q)=> !up(e, q) && !rfc(e, q) && !atm(e, q);
const c6 = (e, q)=> !up(e, q) || rfc(e, q);



const buildBCLAutomata = (acceptanceEvent, garbageEvent)=>PDABuilder.makePDAutomata('UTP')
    .addRule('UTP', 'UTP', up)
    .addRule('UTP', 'G', c0)
    .addRule('UTP', 'Down-No-Pm', c2)
    .addRule('Down-No-Pm', 'Down-No-Pm', c2)
    .addRule('Down-No-Pm', 'G', c0)
    .addRule('Down-No-Pm', 'UTP', c1)
    .addRule('Down-No-Pm', 'InPM', c3)
    .addRule('UTP', 'InPM', c3)
    .addRule('InPM', 'PM-WA', atm)
    .addRule('InPM', 'RFC1', rfc)
    .addRule('PM-WA', 'RFC1', rfc)
    .addRule('RFC1', 'RFC2', rfc)
    .addRule('RFC2', 'RFC3', rfc)
    .addRule('RFC3', 'PM-NO-FQ', rfc)
    .addRule('PM-NO-FQ', 'EP', up)
    .addRule('RFC3', 'EP', up)
    //else rules
    .addRule('InPM', 'InPM', c5)
    .addRule('PM-WA', 'PM-WA', c4)
    .addRule('RFC1', 'RFC1', c4)
    .addRule('RFC2', 'RFC2', c4)
    .addRule('RFC3', 'RFC3', c4)
    .addRule('RFC3', 'RFC3', c4)
    .addRule('RFC3', 'RFC3', c4)
    .addRule('PM-NO-FQ', 'PM-NO-FQ', c6)
    //garbage rules
    .addRule('InPM', 'G', up)
    .addRule('PM-WA', 'G', up)
    .addRule('RFC1', 'G', up)
    .addRule('RFC2', 'G', up)
    .setAcceptanceState('EP', acceptanceEvent)
    .setAcceptanceState('G', garbageEvent);




exports.buildBCLAutomata = buildBCLAutomata;
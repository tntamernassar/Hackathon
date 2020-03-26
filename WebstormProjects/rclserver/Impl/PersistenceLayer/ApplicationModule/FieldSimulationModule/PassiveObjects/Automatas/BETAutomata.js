const PDABuilder = require('../../../../../BusinessLogicLayer/PassiveObjects/Automata/PDAutomataBuilder');




const c1 = (e, q)=>e.availability === 'Up' && e.checklist_name !== 'SubBETncClean3PM' && e.checklist_name !== 'SubBETcuClean3PM';

const c2 = (e, q)=> e.checklist_name === 'SubBETncClean3PM' || e.checklist_name === 'SubBETcuClean3PM' && e.availability === 'Down';

const c3 = (e, q)=>e.availability === 'Down' && e.checklist_name !== 'SubBETncClean3PM' && e.checklist_name !== 'SubBETcuClean3PM';

const c4 = (e, q)=>e.checklist_name === 'SubBETncClean3PM' || e.checklist_name === 'SubBETcuClean3PM' && e.availability === 'Down';

const c5 = (e, q)=>e.event !== 'EqpBeginPM' && e.availability === 'Down';

const c6 = (e, q)=>e.event === 'EqpBeginPM' && e.state === 'InPM' && e.availability === 'Down';

const c7 = (e, q)=>e.event.toLowerCase().indexOf('automon') === -1;

const c8 = (e, q)=>e.event.toLowerCase().indexOf('automon') !== -1 && e.availability === 'Down';

const c9 = (e, q)=>e.availability === 'Down';

const c10 = (e, q)=>e.availability === 'Up';

const c11 = (e, q)=>e.availability === 'Down' && e.checklist_name !== 'SubBETncClean3PM' && e.checklist_name !== 'SubBETcuClean3PM';

const c12 = (e, q)=>e.availability === 'Up' && e.checklist_name !== 'SubBETncClean3PM' && e.checklist_name !== 'SubBETcuClean3PM';

const terminator = (e, q)=> e.availability === 'Up';

const buildBETAutomata = (acceptanceEvent, garbageEvent)=> PDABuilder.makePDAutomata('UTP')
                                .addRule('UTP', 'UTP', c1)
                                .addRule('UTP', 'PP_CLN3', c2)
                                .addRule('UTP', 'Down-No-Pm', c3)
                                .addRule('Down-No-Pm', 'PP_CLN3', c4)
                                .addRule('PP_CLN3', 'PP_CLN3', c5)
                                .addRule('PP_CLN3', 'EQ', c6)
                                .addRule('EQ', 'EQ', c7)
                                .addRule('EQ', 'REC', c8)
                                .addRule('REC', 'REC', c9)
                                .addRule('REC', 'EP', c10)
                                .addRule('Down-No-Pm', 'Down-No-Pm', c11)
                                .addRule('Down-No-Pm', 'UTP', c12)
                                .addRule('PP_CLN3', 'Garbage', terminator)
                                .addRule('EQ', 'Garbage', terminator)
                                .setAcceptanceState('EP', acceptanceEvent)
                                .setAcceptanceState('Garbage', garbageEvent);


exports.buildBETAutomata = buildBETAutomata;






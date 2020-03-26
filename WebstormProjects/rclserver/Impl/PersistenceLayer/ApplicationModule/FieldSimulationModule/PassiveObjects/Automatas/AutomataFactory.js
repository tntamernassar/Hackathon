const BET_PDA = require('./BETAutomata');
const BET_V2_PDA = require('./BETAutomataV2');
const BCL_PDA = require('./BCLAutomata');
const RCL_PDA = require('./RCLAutomata');

/**
 * Automata Factory
 * BET/BCL/RCL Automata's Describing Preventive Maintenance states
 * events received will be in one of the following formats:
 *
 * e = {
 *     type='event', entity, txn_date, availability, state, comments, shift, event, checklist_name
 * }
 *
 * a = {
 *     type='alarm', entity, txn_date, alarm_id, alarm_text
 * }
 *
 * rfc = {
 *     type='rfc', entity, txn_date, lot, test_name, foup_slot, process_sc_batchid
 * }
 *
 * **/


const buildAutomata = (ceid, acceptanceEvent, garbageEvent)=>
    ceid === 'BET' ? BET_PDA.buildBETAutomata(acceptanceEvent, garbageEvent) :
    ceid === 'BETV2' ? BET_V2_PDA.buildBETAutomata(acceptanceEvent, garbageEvent) :
    ceid === 'BCL' ? BCL_PDA.buildBCLAutomata(acceptanceEvent, garbageEvent) :
    ceid === 'RCL' ? RCL_PDA.buildRCLAutomata(acceptanceEvent, garbageEvent) : undefined;



exports.buildAutomata = buildAutomata;
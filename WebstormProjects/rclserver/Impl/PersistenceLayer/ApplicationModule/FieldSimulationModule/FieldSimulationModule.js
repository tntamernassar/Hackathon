const AppModule = require('../../../BusinessLogicLayer/PassiveObjects/AppModule.js');
const Queue = require('../../../BusinessLogicLayer/PassiveObjects/Queue.js');
const FileSystem = require('../../../DBAccess/FileSystem');
const AutomataFactory = require('./PassiveObjects/Automatas/AutomataFactory');
const Field = require('./PassiveObjects/Field');
const HTTPFileReader = require('../../../ServiceLayer/Services/HTTPFileReader')
const AcceptanceHandler = require('./PassiveObjects/AcceptanceHandler');

const delimiter = '[|~|]';

const _isNotifyEventCommand = (command)=>command === "NE";
const _isNotifyEventOverFileCommand = (command)=>command === "NEOF";
const _isRegisterEntityListenerCommand = (command)=>command === "REL";
const _isGetEntityStateCommand = (command)=>command === "GES";
const _isGetFieldEntitiesCommand = (command)=>command === "GFE";

const createEvent = (entity, txn_date, availability, state, comments, shift, event, checklist_name)=>({
    entity: entity,
    txn_date:txn_date,
    availability:availability,
    state:state,
    comments:comments,
    shift:shift,
    event:event,
    checklist_name:checklist_name
});

class FieldSimulationModule extends AppModule{

    constructor(){
        super();

    }

    //request.utf8Data = FS X
    process(connectionHandler, request) {
        let command = request.utf8Data.split(' ')[1];
        _isNotifyEventCommand(command) ? this.processNotifyEventCommand(connectionHandler, request) :
            _isNotifyEventOverFileCommand(command)? this.processNotifyEventOverFileCommand(connectionHandler, request):
                _isRegisterEntityListenerCommand(command) ? this.processRegisterEntityListenerCommand(connectionHandler, request) :
                    _isGetEntityStateCommand(command) ? this.processGetEntityStateCommand(connectionHandler, request) :
                        _isGetFieldEntitiesCommand(command) ? this.processGetFieldEntitiesCommand(connectionHandler, request) : new Error('Unknown command ' + command );
    }

    //initialize FieldSimulation module
    init() {
        this.EventQueue= new Queue();
        this.field = new Field();

        let entities = JSON.parse(FileSystem.readLocalFile('Entities.json'));

        //Add tools
        entities['RCL'].forEach(
            (entity)=> this.field.addRCL(
                entity,
                AutomataFactory,
                AcceptanceHandler.HandleRCLAcceptance,
                AcceptanceHandler.HandleRCLGarbage
            )
        );


        entities['BET'].forEach(
            (entity)=> this.field.addBET(
                entity,
                AutomataFactory,
                AcceptanceHandler.HandleBETAcceptance,
                AcceptanceHandler.HandleBETGarbage
            )
        );

        entities['BCL'].forEach(
            (entity)=> this.field.addBCL(
                entity,
                AutomataFactory,
                AcceptanceHandler.HandleBCLAcceptance,
                AcceptanceHandler.HandleBCLGarbage
            )
        );

    }

    //request.utf8Data = FS NE X
    processNotifyEventCommand(connectionHandler, request){
        let command = request.utf8Data.split(' ');
        command = command.slice(2, command.length);
        command = command.join(' ');
        let e = JSON.parse(command);
        this.EventQueue.push(e);
        this.field.notifyEvent(this.EventQueue.pop());
    }

    //request.utf8Data = FS NEOF path
    processNotifyEventOverFileCommand(connectionHandler, request){
        let command = request.utf8Data.split(' ');
        command = command.slice(2, command.length);

        let path = command.join('');

        HTTPFileReader.readFromPath(path, (body)=>{
                let events = JSON.parse(body).events;
                for(let e in events){
                    let event = events[e];
                    this.field.notifyEvent(event);
                }
            },
            (error)=>{
                console.log(error);
            }
        );

    }

    //FS REL ALL
    //FS REL Entity
    processRegisterEntityListenerCommand(connectionHandler, request){
        let entity = request.utf8Data.split(' ')[2];
        if(entity === 'ALL'){
            this.field.registerAllEntitiesListener(connectionHandler);
        }else{
            this.field.registerEntityListener(connectionHandler, entity)
        }
    }

    //FS GES X
    processGetEntityStateCommand(connectionHandler, request){
        let entity = request.utf8Data.split(' ')[2];
        connectionHandler.sendMessage(this.field.getEntityState(entity));
    }

    //FS GFE
    processGetFieldEntitiesCommand(connectionHandler, request){
        let data = {
          "entities":  this.field.getFieldEntities()
        };
        connectionHandler.sendMessage("FE " + JSON.stringify(data));
    }


}

module.exports = FieldSimulationModule;
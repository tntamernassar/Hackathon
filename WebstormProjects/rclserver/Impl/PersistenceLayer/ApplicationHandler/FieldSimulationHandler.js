const AppHandler = require('../../BusinessLogicLayer/PassiveObjects/AppHandler.js');

class FieldSimulationHandler extends AppHandler{

    constructor(AppModel, next){
        super(AppModel, next);
    }

    shouldHandle(connection, request) {
        return request.utf8Data.split(' ')[0] === 'FS';
    }
}


module.exports = FieldSimulationHandler;
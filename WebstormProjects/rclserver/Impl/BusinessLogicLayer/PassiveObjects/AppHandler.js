class AppHandler{

    constructor(AppModel, next){
        this.next = next;
        this.AppModel = AppModel;
    }

    shouldHandle(connectionHandler, request){
        throw new Error("shouldHandle should be implemented")
    }

    handle(connectionHandler, request){
        if(this.shouldHandle(connectionHandler, request))
            this.AppModel.process(connectionHandler, request);
        else if(this.next === undefined)
            throw new Error("can't find a handler to handle ' "+ JSON.stringify(request) + " '");
        else
            this.next.handle(connectionHandler, request);
    }

}


module.exports = AppHandler;
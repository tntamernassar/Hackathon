/*Application Module protocol handler */
class AppModule{

    constructor(){
        this.init();
    }

    process(connectionHandler, request){
        throw new Error("process should be implemented");
    }

    init(){
        throw new Error("init should be implemented")
    }
}


module.exports = AppModule;
class Server{

    constructor(host, port, chainHead) {
        this.host = host;
        this.port = port;
        this.chainHead = chainHead;
    }

    serve(){
        throw new Error("serve should be implemented");
    }

    send(connection, data){
        throw new Error("send should be implemented");
    }

    Chain(connection, message){
        this.chainHead.handle(connection, message);
    }
}

module.exports = Server;
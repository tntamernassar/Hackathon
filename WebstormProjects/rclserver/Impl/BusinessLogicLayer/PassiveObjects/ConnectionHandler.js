class ConnectionHandler {

    constructor(server, connection) {
        this.server = server;
        this.connection = connection;
        this.alive = true;
    }

    isAlive(){
        return this.alive;
    }

    kill(){
        this.alive = false;
    }

    getConnection(){
        return this.connection;
    }

    getIP(){
        return this.connection.remoteAddress;
    }

    getServer(){
        return this.server;
    }

    sendMessage(msg){
        this.getServer().send(this, msg);
    }
}


module.exports = ConnectionHandler;
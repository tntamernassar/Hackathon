const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocketServer = require('websocket').server;
const Server = require('../../../BusinessLogicLayer/PassiveObjects/Server.js');
const ConnectionHandler = require('../../../BusinessLogicLayer/PassiveObjects/ConnectionHandler');


class HTTPServer extends Server{

    constructor(host, port, chainHead){
        super(host, port, chainHead);
    }

    serve() {
        const server = http.createServer();

        server.listen(this.port, this.host, ()=>{
            console.log("Running http server at " + this.port);
        });

        this.handle(new WebSocketServer({
            httpServer: server
        }));
    }

    handle(serverObject){
        this.handleRequest(this, serverObject);
    }

    handleRequest(self, wsServer){
        wsServer.on('request', function(request) {
            const connectionHandler = new ConnectionHandler(self, request.accept(null, request.origin));
            self.handleMessage(self, connectionHandler);
            self.handleClose(self, connectionHandler);
            self.clientId++;
        });
    }

    handleMessage(self, connectionHandler){
        connectionHandler.getConnection().on('message', function(message) {
            self.Chain(connectionHandler, message);
        });
    }

    handleClose(self, connectionHandler){
        connectionHandler.getConnection().on('close', function(reasonCode, description) {
            connectionHandler.kill();
        });
    }


    send(connectionHandler, msg){
        connectionHandler.getConnection().sendUTF(msg);
    }

    sendFile(self, connectionHandler, filePath){
        fs.readFile(filePath, "utf8", function(err, data) {
            self.send(connectionHandler, data.toString());
        });
    }
}

module.exports = HTTPServer;
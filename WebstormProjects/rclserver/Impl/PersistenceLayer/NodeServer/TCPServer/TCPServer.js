const net = require('net');
const dns = require('dns');

const Server = require('../../../BusinessLogicLayer/PassiveObjects/Server');
const ConnectionHandler = require('../../../BusinessLogicLayer/PassiveObjects/ConnectionHandler');


TERMINATOR = '\0';

class TCPServer extends Server{

    constructor(host, port, chainHead){
        super(host, port, chainHead);
    }

    serve() {
        let tcp_server = this;
        const server = net.createServer((socket)=>this.handleConnection(this, new ConnectionHandler(tcp_server, socket))).on('error', this.handleError);
        server.listen(this.port, this.host, () => {
            console.log('Running TCP server on', server.address().port);
        });
    }

    handleConnection(self, connectionHandler){
        connectionHandler.getConnection().on('data', (data) => {
            self.handleData(self, connectionHandler, data)
        });

        connectionHandler.getConnection().on('close', (reasonCode, description) => {
            connectionHandler.kill();
        });
        connectionHandler.getConnection().on('end', (reasonCode, description) => {
            connectionHandler.kill();
        });

        connectionHandler.getConnection().on('error', (reasonCode, description) => {
            connectionHandler.kill();
        });
    }

    handleData(self, connectionHandler, data){
        self.Chain(connectionHandler, {utf8Data : data.toString()});
    }

    handleError(err){
        console.log(err);
    }

    send(connectionHandler, msg){
        connectionHandler.getConnection().write(msg + TERMINATOR);
    }
}

module.exports = TCPServer;
const HTTPServer = require('../../PersistenceLayer/NodeServer/HTTPServer/HTTPServer');
const TCPServer = require('../../PersistenceLayer/NodeServer/TCPServer/TCPServer');
const FieldSimulationHandler = require('../../PersistenceLayer/ApplicationHandler/FieldSimulationHandler.js');
const FieldSimulationModule = require('../../PersistenceLayer/ApplicationModule/FieldSimulationModule/FieldSimulationModule.js');
const SQLConnectivity = require('../../DBAccess/SQLDatabase/SQLConnectivity');


let chain = new FieldSimulationHandler(
    new FieldSimulationModule(),
    undefined
);

let host = "10.114.136.5";

const Runner = () => [
    new HTTPServer(host, 8080, chain),
    new TCPServer(host, 8181, chain)
].map((server) => server.serve());


Runner();

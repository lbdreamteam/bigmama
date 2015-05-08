module.exports = {
    create: function (port, movementGridSize, spawnPoint, pHandlers, onInit, extraPackages) {
        return new LBServer(port, movementGridSize, spawnPoint, pHandlers, onInit, extraPackages);
    },
    version: 'v0.0.0.0'
}

LBServer = function (port, movementGridSize, spawnPoint, pHandlers, onInit, extraPackages) {

    if (!port) {
        console.error('port is not defined');
        return null;
    }
    extraPackages = extraPackages || {};
    onInit = onInit || null;

    ///PROPS
    this.nodeSettings = { app: null, httpServer: null, modules: {} };
    this.serverInstance;
    this.posTable = { nowPos: {}, oldPod: {} };
    this.spawnPoint = spawnPoint || { sTx: 1, sTy: 1 };
    this.movementGridSize = movementGridSize || 32;

    ///NODE SETTINGS
    this.init(extraPackages, onInit);

    //Moduli LB (importati dopo il metodo init perchè possono richiedere moduli npm
    this.clients = require('./LBClientsManagerModule.js').create(this);
    this.pHandlers = require('./LBServerPrivateHandlersModule.js').create(this, pHandlers);

    //AVVIO
    this.start(port);
}

LBServer.prototype = Object.create(Object);
LBServer.prototype.constructor = LBServer;

LBServer.prototype.init = function (extraPackages, onInit) {
    //REQUIRES
    this.nodeSettings.modules['express'] = require('express');
    this.nodeSettings.modules['eureca.io'] = require('eureca.io');
    this.nodeSettings.modules['cli-color'] = require('cli-color');

    if (extraPackages) for (var node_package in extraPackages) this.nodeSettings.modules[node_package] = require(node_package);
    this.nodeSettings.app = this.nodeSettings.modules['express'](this.nodeSettings.app);
    this.nodeSettings.httpServer = require('http').createServer(this.nodeSettings.app);

    this.nodeSettings.app.use(this.nodeSettings.modules['express'].static(__dirname));

    if (onInit) onInit(this);
};

LBServer.prototype.start = function (port) {

    console.log(this.nodeSettings.modules['cli-color'].blue.bgWhite('LB server ' + module.exports.version));

    this.serverInstance = new this.nodeSettings.modules['eureca.io'].EurecaServer({ allow: ['serverHandler'] });

    this.serverInstance.attach(this.nodeSettings.httpServer);
    console.log('port ' + port);

    this.serverInstance.onConnect(function (conn) {
        this.clients.onConnect(conn);
        //console.log('Connected new client: ' + conn.id + ' --From ' + conn.remoteAddress);
        //this.clients[conn.id] = { id: conn.id, remote: eurecaServer.getClient(conn.id), state: { x: 1, y: 1 } };
        //this.posTable.nowPos[conn.id] = this.clients[conn.id].state;
        //this.clients[conn.id].remote.serverHandler({ event: 'createGame', params: { id: conn.id, Tx: this.clients[conn.id].state.x, Ty: this.clients[conn.id].state.y } });
    });    

    var serverInstance = this;

    this.serverInstance.exports.clientHandler = function (args) {
        console.log('Received request for action: ' + args.event + ' from ' + (args.params.clientId || 'unidentified'));
        serverInstance.pHandlers.callHandler({ event: args.event, params: args.params });
    }

    this.nodeSettings.httpServer.listen(port);


    //ATTIVAZIONE FREQUENZA DI UPDATE SERVER
    var serverUpdate = setInterval(function () {
        serverInstance.clients.update();
    }, 100);

};
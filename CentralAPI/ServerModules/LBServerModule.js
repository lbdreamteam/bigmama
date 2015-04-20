module.exports = {
    create: function (port, extraPackages, onInit) {
        return new LBServer(port, extraPackages, onInit);
    }
}

LBServer = function (port, extraPackages, onInit) {

    if (!port) {
        console.error('port is not defined');
        return null;
    }
    extraPackages = extraPackages || {};
    onInit = onInit || null;

    ///PROPS
    this.nodeSettings = { app: null, httpServer: null, packages: {} };
    this.serverInstance;
    this.clients = require('./LBClientsManagerModule.js').create();
    this.posTable = { nowPos: {}, oldPod: {} };

    ///NODE SETTINGS
    this.init(extraPackages, onInit);

    //AVVIO
    this.start(port);
}

LBServer.prototype = Object.create(Object);
LBServer.prototype.constructor = LBServer;

LBServer.prototype.init = function (extraPackages, onInit) {

    this.nodeSettings.packages['express'] = require('express');
    if (extraPackages) for (var node_package in extraPackages) this.nodeSettings.packages[node_package] = require(node_package);
    this.nodeSettings.app = express(app);
    this.nodeSettings.httpServer = require('http').createServer(app);

    this.nodeSettings.app.use(this.nodeSettings.packages['express'].static(__dirname));

    if (onInit) onInit();
};

LBServer.prototype.start = function (port) {
    var eurecaServer = require('eureca.io').eurecaServer;
    this.serverInstance = new eurecaServer({ allow: ['serverHandler'] });

    this.serverInstance.onConnect(function(conn) {
        console.log('Connected new client: ' + conn.id + ' --From ' + conn.remoteAddress);
        this.clients[conn.id] = { id: conn.id, remote: eurecaServer.getClient(conn.id), state: { x: 1, y: 1 } };
        this.posTable.nowPos[conn.id] = this.clients[conn.id].state;
        this.clients[conn.id].remote.serverHandler({ event: 'createGame', params: { id: conn.id, Tx: this.clients[conn.id].state.x, Ty: this.clients[conn.id].state.y } });
    });

    eurecaServer.attach(this.serverInstance);
    this.serverInstance.listen(port);
};
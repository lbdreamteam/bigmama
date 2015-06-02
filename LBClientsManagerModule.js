module.exports = {
    create: function (serverInstance) {
        return new LBCLientsManager(serverInstance);
    },
    version: 'v0.0.0.0'
}

LBCLientsManager = function (serverInstance) {
    //PROPRS
    this.serverInstance = serverInstance;
    //IDs & Groups
    this.ids = [];
    this.info = {};
    this.nowConnected = [];
    this.nowUpdating = [];
    this.calls = { counter: 0, list: {} };

    //PosTables
    this.posTable = { oldPos: {}, nowPos: {} };

    this.init();
    this.start();
}

LBCLientsManager.prototype = Object.create(Object);
LBCLientsManager.prototype.constructor = LBCLientsManager;

LBCLientsManager.prototype.init = function () {

};

LBCLientsManager.prototype.start = function () {
    console.log(this.serverInstance.nodeSettings.modules['cli-color'].blue.bgWhite('LB csMan ' + module.exports.version));
};

LBCLientsManager.prototype.onConnect = function (conn) {
    console.log('Connected new client --ID ' + conn.id + ' --Origin ' + conn.remoteAddress.ip);

    var remote = eurecaInstance.getClient(conn.id),
        firstPos = {Tx: this.serverInstance.spawnPoint.sTx, Ty: this.serverInstance.spawnPoint.sTy};

    this.ids.push(conn.id);
    this.nowConnected.push(conn.id);
    this.info[conn.id] = { remote: remote, connInfo: { id: conn.id, ip: conn.remoteAddress }};
    this.posTable.nowPos[conn.id] = firstPos;

    this.callRemoteHandler(conn.id, { event: 'createGame', params: { id: conn.id, Tx: firstPos.Tx, Ty: firstPos.Ty } });
};

LBCLientsManager.prototype.onDisconnect = function (conn) {

    console.log('Disconnected client --ID ' + conn.id + ' --Origin ' + conn.remoteAddress.ip);
    delete this.info[conn.id];
    delete this.ids[this.ids.indexOf(conn.id)];
    delete this.nowConnected[this.nowConnected.indexOf(conn.id)];
    delete this.nowUpdating[this.nowUpdating.indexOf(conn.id)];
    delete this.posTable.nowPos[conn.id];
    delete this.posTable.oldPos[conn.id];
    for (var id in this.ids) {
        this.callRemoteHandler(this.ids[id], { event: 'onOtherPlayerDisconnect', params: { id: conn.id } });
    }
};

LBCLientsManager.prototype.update = function () {
    this.posTable.oldPos = JSON.parse(JSON.stringify(this.posTable.nowPos));
    for (var iConnected in this.nowConnected) {
        var idConnected = this.nowConnected[iConnected];
        for (var iClient in this.ids) if (this.ids[iClient] != idConnected) {
            this.callRemoteHandler(this.ids[iClient], { event: 'onOtherPlayerConnect', params: { id: idConnected, oldPos: this.posTable.oldPos[idConnected], nowPos: this.posTable.nowPos[idConnected] } });
        }
        this.callRemoteHandler(idConnected, { event: 'spawnOtherPlayers', params: { posTable: this.posTable } });
        delete this.nowConnected[iConnected];
    }
    var updatingPos = function (id) {
        var out = {};
        for (var iUpdating in this.nowUpdating) if (this.nowUpdating[iUpdating] != id) out[this.nowUpdating[iUpdating]] = this.posTable.nowPos[this.nowUpdating[iUpdating]];
        return out;
    }
    for (var iUpdating in this.nowUpdating) {
        var tmp = updatingPos(this.nowUpdating[iUpdating]);
        if (Object.keys(tmp).length !== 0) this.callRemoteHandler(this.nowUpdating[iUpdating], { event: 'updateOtherPlayers', params: { posTable: tmp } });
    }
    this.nowUpdating = this.ids.slice();
};

LBCLientsManager.prototype.digestInput = function (params) {
    this.posTable.nowPos[params.clientId].Tx += params.increment.x;
    this.posTable.nowPos[params.clientId].Ty += params.increment.y;
    this.calls.list[this.calls.counter] = this.posTable.nowPos[params.clientId];
    this.calls.counter++;

    this.callRemoteHandler(params.clientId, { event: 'updatePlayer', params: { x: this.posTable.nowPos[params.clientId].x, y: this.posTable.nowPos[params.clientId].y }, callId: params.callId });
}

LBCLientsManager.prototype.callRemoteHandler = function (connId, args) {
    this.info[connId].remote.serverHandler(args);
};

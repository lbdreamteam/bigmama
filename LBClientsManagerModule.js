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
    this.ids = { online: [], joined: [] };
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

LBCLientsManager.prototype.onReady = function (id) {
    this.ids.joined.push(id);
    this.nowConnected.push(id);
    this.info[id].joined = true;
    this.callRemoteHandler(id, { 'event': 'joined', params: {} });
    console.log('Joined ' + id);
};

LBCLientsManager.prototype.onConnect = function (conn) {
    console.log('Connected new client --ID ' + conn.id + ' --Origin ' + conn.remoteAddress.ip);

    var remote = eurecaInstance.getClient(conn.id),
        firstPos = {Tx: this.serverInstance.spawnPoint.sTx, Ty: this.serverInstance.spawnPoint.sTy};

    this.ids.online.push(conn.id);
    this.info[conn.id] = { remote: remote, connInfo: { id: conn.id, ip: conn.remoteAddress }, joined: false};
    this.posTable.nowPos[conn.id] = firstPos;

    this.callRemoteHandler(conn.id, { event: 'createGame', params: { id: conn.id, Tx: firstPos.Tx, Ty: firstPos.Ty, port: this.serverInstance.port } });
};

LBCLientsManager.prototype.onDisconnect = function (conn) {

    console.log('Disconnected client --ID ' + conn.id + ' --Origin ' + conn.remoteAddress.ip);
    delete this.info[conn.id];
    delete this.ids.online[this.ids.online.indexOf(conn.id)];
    delete this.ids.joined[this.ids.joined.indexOf(conn.id)];
    delete this.nowConnected[this.nowConnected.indexOf(conn.id)];
    delete this.nowUpdating[this.nowUpdating.indexOf(conn.id)];
    delete this.posTable.nowPos[conn.id];
    delete this.posTable.oldPos[conn.id];
    for (var id in this.ids.joined) {
        this.callRemoteHandler(this.ids.joined[id], { event: 'onOtherPlayerDisconnect', params: { id: conn.id } });
    }
};

LBCLientsManager.prototype.update = function () {
    this.posTable.oldPos = JSON.parse(JSON.stringify(this.posTable.nowPos));
    for (var iConnected in this.nowConnected) {
        var idConnected = this.nowConnected[iConnected];
        for (var iClient in this.ids.joined) if (this.ids.joined[iClient] != idConnected) this.callRemoteHandler(this.ids.joined[iClient], { event: 'onOtherPlayerConnect', params: { id: idConnected, oldPos: this.posTable.oldPos[idConnected], nowPos: this.posTable.nowPos[idConnected] } });  
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
    this.nowUpdating = this.ids.joined.slice();
};

LBCLientsManager.prototype.digestInput = function (params) {
    this.posTable.nowPos[params.clientId].Tx += params.increment.x;
    this.posTable.nowPos[params.clientId].Ty += params.increment.y;
    this.calls.list[this.calls.counter] = this.posTable.nowPos[params.clientId];
    this.calls.counter++;
    console.log('Sending data for reconciliation to ' + params.clientId, this.posTable.nowPos[params.clientId].Tx, this.posTable.nowPos[params.clientId].Ty, params.callId);
    this.callRemoteHandler(params.clientId, { event: 'updatePlayer', params: { x: this.posTable.nowPos[params.clientId].Tx, y: this.posTable.nowPos[params.clientId].Ty, callId: params.callId } });
}

LBCLientsManager.prototype.callRemoteHandler = function (connId, args) {
    this.info[connId].remote.serverHandler(args);
};

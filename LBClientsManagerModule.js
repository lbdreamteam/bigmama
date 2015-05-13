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
    //this.ids.push(id);
    //this.nowConnected.push(id);

    var remote = eurecaInstance.getClient(conn.id),
        firstPos = {Tx: this.serverInstance.spawnPoint.sTx, Ty: this.serverInstance.spawnPoint.sTy};
    //this.callRemoteHandler(conn.id, { event: 'authentication' });

    this.ids.push(conn.id);
    this.nowConnected.push(conn.id);
    this.info[conn.id] = { remote: remote, connInfo: { id: conn.id, ip: conn.remoteAddress }};
    this.posTable.nowPos[conn.id] = firstPos;
    //delete this.nowUpdating[this.nowUpdating.indexOf(conn.id)]; Questo comando sarebbe utile nel caso il connect venisse effettuato a cavallo di un sync, ma 
    //non credo che gli interval vadano su thread diversi data la loro imprecisione, e test dimostrano che al momento del connect è sempre null.

    //console.log('conn.id: ' + conn.id);
    this.callRemoteHandler(conn.id, { event: 'createGame', params: { id: conn.id, Tx: firstPos.Tx, Ty: firstPos.Ty } });
};

LBCLientsManager.prototype.onDisconnect = function (conn) {
    //var id = this.info[conn.id].id;
    delete this.info[conn.id];
    delete this.ids[this.ids.indexOf(conn.id/*id*/)];
    delete this.nowConnected[this.nowConnected.indexOf(conn.id/*id*/)];
    delete this.nowUpdating[this.nowUpdating.indexOf(conn.id/*id*/)];
    for (var id in this.ids) {

        //console.log('ids: ' + id);
        this.callRemoteHandler(this.ids[id], { event: 'onOtherPlayerDisconnect', params: { id: conn.id } });
    }
};

LBCLientsManager.prototype.update = function () {
    this.posTable.oldPos = JSON.parse(JSON.stringify(this.posTable.nowPos));
    for (var iConnected in this.nowConnected) {
        var idConnected = this.nowConnected[iConnected];
        for (var id in this.ids) if (id != this.nowConnected[iConnected]) {

            //console.log('nowConnected[id]: ' + this.nowConnected[id]);
            this.callRemoteHandler(this.nowConnected[id], { event: 'onOtherPlayerConnect', params: { id: idConnected, oldPos: this.posTable.oldPos[idConnected], nowPos: this.posTable.nowPos[idConnected] } });
        }

        //console.log('idConnected: ' + idConnected);
        this.callRemoteHandler(idConnected, { event: 'spawnOtherPlayer', params: { posTable: this.posTable } });
    }
    var updatingPos = function () {
        var out = {};
        for (var iUpdating in this.nowUpdating) out[this.nowUpdating[iUpdating]] = this.posTable.nowPos[this.nowUpdating[iUpdating]];
        return out;
    }
    for (var iUpdating in this.nowUpdating) {

        //console.log('nowUpdateing: ' + this.nowUpdating[iUpdating]);
        this.callRemoteHandler(this.nowUpdating[iUpdating], { event: 'updateOtherPlayers', params: { posTable: updatingPos } });
    }
    this.nowUpdating = this.ids.slice();
};

LBCLientsManager.prototype.digestInput = function (params) {
    this.posTable.nowPos[params.clientId].Tx += params.increment.x;
    this.posTable.nowPos[params.clientId].Ty += params.increment.y;
    this.calls.list[this.calls.counter] = this.posTable.nowPos[params.clientId];
    this.calls.counter++;

    //console.log('params: ' + params);
    this.callRemoteHandler(params.clientId, { event: 'updatePlayer', params: { x: this.posTable.nowPos[params.clientId].x, y: this.posTable.nowPos[params.clientId].y }, callId: params.callId });
}

LBCLientsManager.prototype.callRemoteHandler = function (connId, args) {

    //console.log('Conn ID: ' + connId);
    this.info[connId].remote.serverHandler(args);
};

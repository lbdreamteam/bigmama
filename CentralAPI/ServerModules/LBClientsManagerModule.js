module.exports = {
    create: function () {
        return new LBCLientsManager();
    }
}

LBCLientsManager = function () {
    //IDs & Groups
    this.ids = [];
    this.info = {};
    this.nowConnected = [];
    this.nowUpdating = [];

    //PosTables
    this.posTable = { oldPos: {}, nowPos: {} };
}

LBCLientsManager.prototype = Object.create(Object);
LBCLientsManager.prototype.constructor = LBCLientsManager;

LBCLientsManager.prototype.postMessage = function (connId, args) {
    this.info[connId].remote.serverHandler(args);
};

LBCLientsManager.prototype.onConnect = function (/*id,*/ conn, sTx, sTy) {
    //this.ids.push(id);
    //this.nowConnected.push(id);

    var remote = eurecaServer.getClient(conn.id);
    this.postMessage(conn.id, { event: 'authentication' });

    this.ids.push(conn.id);
    this.nowConnected.push(conn.id);
    this.info[conn.id] = { /*id: id,*/ remote: eurecaServer.getClient(conn.id), connInfo: { id: conn.id, ip: conn.remoteAddress }, state: { x: sTx, y: sTy } };
    this.posTable.nowPos[conn.id] = this.info[conn.id].state;
    //delete this.nowUpdating[this.nowUpdating.indexOf(conn.id)]; Questo comando sarebbe utile nel caso il connect venisse effettuato a cavallo di un sync, ma 
    //non credo che gli interval vadano su thread diversi data la loro imprecisione, e test dimostrano che al momento del connect è sempre null.
    this.postMessage(conn.id, { event: 'createGame', params: { id: conn.id, Tx: this.info[conn.id].state.x, Ty: this.info[conn.id].state.y } });
};

LBCLientsManager.prototype.onDisconnect = function (conn) {
    //var id = this.info[conn.id].id;
    delete this.info[conn.id];
    delete this.ids[this.ids.indexOf(conn.id/*id*/)];
    delete this.nowConnected[this.nowConnected.indexOf(conn.id/*id*/)];
    delete this.nowUpdating[this.nowUpdating.indexOf(conn.id/*id*/)];
};


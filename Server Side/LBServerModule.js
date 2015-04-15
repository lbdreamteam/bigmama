module.exports = {
    LBServer: LBServer
}

LBServer = function (extraPackages, onInit) {

    extraPackages = extraPackages || {};
    onInit = onInit || null;

    ///PROPS
    this.nodeSettings = { app: null, httpServer: null, packages: {} };
    this.serverInstance;

    ///NODE SETTINGS
    this.init(extraPackages, onInit);

    //AVVIO
    this.start(allows);
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

LBServer.prototype.start = function (allows) {
    var eurecaServer = require('eureca.io').eurecaServer;
    this.serverInstance = new eurecaServer({ allow: 'serverHandler' });
    //this.serverInstance = new eurecaServer({ allow: allows });
};
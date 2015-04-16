module.exports = {
    LBServer: LBServer
}

LBServer = function (port, extraPackages, onInit) {

    port = port || 8001;
    extraPackages = extraPackages || {};
    onInit = onInit || null;

    ///PROPS
    this.nodeSettings = { app: null, httpServer: null, packages: {} };
    this.serverInstance;

    ///NODE SETTINGS
    this.init(extraPackages, onInit);

    //AVVIO
    this.start(allows, port);
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

LBServer.prototype.start = function (allows, port) {
    var eurecaServer = require('eureca.io').eurecaServer;
    this.serverInstance = new eurecaServer({ allow: 'serverHandler' });

    eurecaServer.attach(this.serverInstance);
    this.serverInstance.listen(process.env.PORT || port);
};
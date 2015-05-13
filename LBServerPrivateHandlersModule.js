module.exports = {
    create : function(serverInstance, pHandlers) {
        return new LBServerPrivateHandlersModule(serverInstance, pHandlers);
    },
    version : 'v0.0.0.0'
}

LBServerPrivateHandlersModule = function (serverInstance, pHandlers) {
    //PROPS
    this.serverInstance = serverInstance;
    this.pHandlers = pHandlers;
    this.params = {};
    this.phs = {};

    this.init();
    this.start();
}

LBServerPrivateHandlersModule.prototype = Object.create(Object);
LBServerPrivateHandlersModule.prototype.constructor = LBServerPrivateHandlersModule;

LBServerPrivateHandlersModule.prototype.init = function () {

};

LBServerPrivateHandlersModule.prototype.start = function () {
    for (var iHandler in this.pHandlers) {
        var handler = this.pHandlers[iHandler];
        this.addHandler(handler.event, handler.params, handler.function);
    }
    console.log(this.serverInstance.nodeSettings.modules['cli-color'].blue.bgWhite('LB spHs ' + module.exports.version));
}

LBServerPrivateHandlersModule.prototype.addHandler = function (event, params, pHandler) {
    this.params[event] = params;
    this.phs[event] = pHandler;
};

LBServerPrivateHandlersModule.prototype.callHandler = function (event, params) {
    //onError non definito!
    onError = onError || function (err) {
        console.error('ERROR --At ' + event + '--Code: ' + err.code);
        return;
    };

    if (!this.phs[event]) onError({ code: 000 });

    for (var p in this.params[event]) if (!params[this.params[event][p]]) onError({ code: 001 });
    this.phs[event](params, this.serverInstance);
};
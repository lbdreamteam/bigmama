module.exports = {
    create : function() {
        return new LBPrivateHandlersModule();
    }
}

LBPrivateHandlersModule = function () {
    this.params = {};
    this.phs = {};
}

LBPrivateHandlersModule.prototype = Object.create(Object);
LBPrivateHandlersModule.prototype.constructor = LBPrivateHandlersModule;

LBPrivateHandlersModule.prototype.addHandler = function (event, params, pHandler) {
    this.params[event] = params;
    this.phs[event] = pHandler;
};

LBPrivateHandlersModule.prototype.callHandler = function (event, params, req, onError, callback) {
    onError = onError || function (err) {
        console.error('ERROR --At ' + event + '--Code: ' + err.code);
        return;
    };

    for (var p in this.params[event]) if (!params[this.params[event][p]]) onError({ code: 0 });
    return this.phs[event](params);
};
LBPrivateHandlers = function () {
    this.params = {};
    this.phs = {};
}

LBPrivateHandlers.prototype = Object.create(Object);
LBPrivateHandlers.prototype.constructor = LBPrivateHandlers;

LBPrivateHandlers.prototype.addHandler = function (event, params, pHandler) {
    this.params[event] = params;
    this.phs[event] = pHandler;
};

LBPrivateHandlers.prototype.callHandler = function (event, params, onError, callback) {
    onError = onError || function (err) {
        console.error('ERROR --At ' + event + '--Code: ' + err.code);
        return;
    };

    for (var p in this.params[event]) if (!params[this.params[event][p]]) onError({ code: 0 });
    this.phs[event](params);
    if (callback) callback();
};
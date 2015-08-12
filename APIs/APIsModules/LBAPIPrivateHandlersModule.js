module.exports = {
    create : function() {
        return new LBPrivateHandlersModule();
    },
    version: 'v0.0.2.2'
}

LBPrivateHandlersModule = function () {
    //PROPS
    this.modules = {};
    this.params = {};
    this.phs = {};
    this.actions = {};

    this.init();
    this.start();
}

LBPrivateHandlersModule.prototype = Object.create(Object);
LBPrivateHandlersModule.prototype.constructor = LBPrivateHandlersModule;

LBPrivateHandlersModule.prototype.init = function () {
    this.modules['cli-color'] = require('cli-color');
};

LBPrivateHandlersModule.prototype.start = function () {
    console.log(this.modules['cli-color'].blue.bgWhite('LB APIpHs ' + module.exports.version));
};

LBPrivateHandlersModule.prototype.addHandler = function (event, method, params, pHandler) {

    //console.log('Adding ' + event + ' ' + method + ' ', params);

    if (!this.actions[method]) this.actions[method] = {};
    this.actions[method][event] = event;

    if (!this.params[method]) this.params[method] = {};
    this.params[method][event] = params;

    if (!this.phs[method]) this.phs[method] = {};
    this.phs[method][event] = pHandler;

};

LBPrivateHandlersModule.prototype.callHandler = function (event, method, params, res, onError, callback) {

    onError = onError || function (err) {
        console.error('ERROR --At ' + event + ' params are not correct --Code: ' + err.code + '; aborting operation...');
        res.statusCode = 400;
        res.send();
    };

    if (!this.actions[method] || !this.actions[method][event]) {
        console.log('Action ' + event + ' not permitted.');
        onError({ code: 400 });
        return;
    }

    for (var iP in this.params[method][event]) if (!params[this.params[method][event][iP]]) {
        onError({ code: 400 });
        return;
    }

    this.phs[method][event](params, res);
};


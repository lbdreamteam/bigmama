module.exports = {
	create: function(port, AWSregion, extraPackages) {
		return new LBAPI(port, AWSregion, extraPackages);
	}
}

LBAPI = function(port, AWSregion, pHandlers, extraPackages) {
	extraPackages = extraPackages || null;
	//PROPS
	this.modules = {};
	this.app;
	this.router;
	this.privateHandlers;

	//FUNCTIONS
	this.init(extraPackages);
	this.start(port, AWSregion, pHandlers);
}

LBAPI.prototype = Object.create(Object);
LBAPI.prototype.constructor = LBAPI;

LBAPI.prototype.init = function(extraPackages) {
	//npm modules
	this.modules['express'] = require('express');
	this.modules['body-parser'] = require('body-parser');
	this.modules['child_process'] = require('child_process');
	this.modules['aws-sdk'] = require('aws-sdk');
	this.modules['cli-color'] = require('cli-color');
	//LBModules
	this.modules['LBPrivateHandlers'] = require('./LBPrivateHandlersModule.js');
	if (extraPackages) for(var key in extraPackages) this.modules[key] = require(extraPackages[key]);
};

LBAPI.prototype.start = function(port, AWSregion, pHandlers) {
	this.app = this.modules['express']();

	this.modules['aws-sdk'].config.update({region : AWSregion});

	this.app.use(this.modules['body-parser'].urlencoded({ extended: true }));
	this.app.use(this.modules['body-parser'].json());

	this.router = this.modules['express'].Router();

	this.privateHandlers = this.modules['LBPrivateHandlers'].create();

	for (var index in pHandlers) {
		var handler = pHandlers[index];
		this.privateHandlers.addHandler(handler.action, handler.params, handler.function);
	}
	var LBAPI = this;
	this.router.get('/:cmd?', function(req, res) {
		LBAPI.privateHandlers.callHandler(req.params.cmd, req.query, res);
	});

	this.app.use('/LBApi', this.router);
	this.app.listen(port);
	console.log(this.modules['cli-color'].blue.bgWhite('LBAPI v0.0.0.1.0'));
};


module.exports = {
	create: function(port, AWSregion, pHandlers, initCallback, enableCORS, extraPackages) {
		return new LBAPI(port, AWSregion, pHandlers, initCallback, enableCORS, extraPackages);
	}
}

LBAPI = function(port, AWSregion, pHandlers, initCallback, enableCORS, extraPackages) {
	enableCORS = enableCORS || true;
	initCallback = initCallback || null;
	extraPackages = extraPackages || null;
	//PROPS
	this.modules = {};
	this.app;
	this.router;
	this.privateHandlers;

	//FUNCTIONS
	this.init(AWSregion, extraPackages, initCallback);
	this.start(port, pHandlers, this, enableCORS);

	//
}

LBAPI.prototype = Object.create(Object);
LBAPI.prototype.constructor = LBAPI;

LBAPI.prototype.init = function(AWSregion, extraPackages, initCallback) {
	//npm modules
	this.modules['express'] = require('express');
	this.modules['body-parser'] = require('body-parser');
	this.modules['child_process'] = require('child_process');
	this.modules['aws-sdk'] = require('aws-sdk');
	this.modules['aws-sdk'].config.update({region : AWSregion});
	this.modules['cli-color'] = require('cli-color');
	//LBModules
	this.modules['LBPrivateHandlers'] = require('./LBPrivateHandlersModule.js');
	if (extraPackages) for(var key in extraPackages) this.modules[key] = require(extraPackages[key]);
	if (initCallback) initCallback(this);
	//AWS-SDK configuration
};

LBAPI.prototype.start = function(port, pHandlers, context, enableCORS) {
	this.app = this.modules['express']();

	this.app.use(this.modules['body-parser'].urlencoded({ extended: true }));
	this.app.use(this.modules['body-parser'].json());

	this.router = this.modules['express'].Router();

	if (enableCORS) this.router.use(function (req, res, next) {
    	res.header("Access-Control-Allow-Origin", "*");
    	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    	next();
	});

	this.privateHandlers = this.modules['LBPrivateHandlers'].create();

	for (var index in pHandlers) {
		var handler = pHandlers[index];
		this.privateHandlers.addHandler(handler.action, handler.params, handler.function);
	}

	//-->QUESTO SERVE PER EVITARE CHE CRASHI A CASO<--
	this.router.get('/', function(req, res) {
		res.json({response: null});
	});

	this.router.get('/:cmd?', function(req, res) {
		console.log('Received request for action: ' + req.params.cmd);
		context.privateHandlers.callHandler(req.params.cmd, req.query, res);
	});

	this.app.use('/LBApi', this.router);
	this.app.listen(port);
	console.log(this.modules['cli-color'].blue.bgWhite('LBAPI v0.0.0.1.2'));
};


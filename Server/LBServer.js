require('./ServerModules/LBServerModule.js').create(
    process.argv[2],
    null,
    null,
    [
        {
            'event': 'sendInput',
            'params': ['increment', 'clientId', 'callId'],
            'function': function (params, serverInstance) {
                console.log('Received sendInput from: ' + params.clientId);
                serverInstance.clients.digestInput(params);
            }
        }
    ],
    function (serverInstance) {
        console.log(serverInstance.nodeSettings.modules['cli-color'].magenta.bgWhite('LBServer v0.0.0.0'));
    }
);
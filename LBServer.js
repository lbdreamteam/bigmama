require('./LBServerModule.js').create(
    process.argv[2],
    null,
    null,
    [
        {
            'event': 'ready',
            'params': ['id'],
            'function': function (params, serverInstance) {
                console.log(params.id + ' is ready to join!');
                serverInstance.clients.onReady(params.id);
            }
        },
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
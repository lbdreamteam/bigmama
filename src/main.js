eurecaClient = new Eureca.Client();
eurecaClient.ready(function (proxy) {
    eurecaServer = proxy;
});

gameInstance = new LBGame(
    800,    //width
    600,    //height
    2500,   //wWidth
    600,    //wHeight
    32,     //MovgridS
    true,   //movIn8Dir
    true,   //overlap
    Phaser.AUTO,    //renderer
    [       //pHs     
        {
            'event': 'onConnect',
            'params': ['id', 'port'],
            'function': function (params) {
                console.log('%cConnected to server', 'background: #76EE00');
                gameInstance.serverPort = params.port;
                myId = params.id;
                gameInstance.otherPlayersW.worker.postMessage({ event: 'init', params: myId });
            }
        },
        {
            'event': 'createGame',
            'params': ['Tx', 'Ty'],
            'function': function (params) {
                console.log('%cCreating game', 'background: #76EE00');
                gameInstance.playerSpawnPoint = { x: params.Tx, y: params.Ty };
                create();
            }
        },
        {
            'event': 'joined',
            'params': [],
            'function': function () {
                joined = true;
                console.log('joined');
            }
        },
        {
            'event': 'updatePlayer',
            'params': ['x', 'y', 'callId'],
            'function': function (params) {
                gameInstance.clientsList[myId].updatePosition(params.x, params.y, params.callId);
            }
        },
        {
            'event': 'updateOtherPlayers',
            'params': ['posTable'],
            'function': function (params) {
                otherPlayersManager.update(params.posTable);
            }
        },
        {
            'event': 'onOtherPlayerConnect',
            'params': ['id', 'oldpos', 'nowPos'],
            'function': function (params) {
                console.log('On other player connect');
                otherPlayersManager.onConnect(params.id, params.oldPos, params.nowPos);
            }
        },
        {
            'event': 'onOtherPlayerDisconnect',
            'params': ['id'],
            'function': function (params) {
                otherPlayersManager.onDisconnect(params.id);
            }
        },
        {
            'event': 'spawnOtherPlayers',
            'params': ['posTable'],
            'function': function (params) {
                otherPlayersManager.spawn(params.posTable);
            }
        }
    ]);

function preload() {
    gameInstance.setVisibilityChangeHandlers();
    gameInstance.loadFonts(
        [    //questa funzione utilizza una queue asincrona che permette di essere certi che la callback verrà eseguita solo a caricamento competato
            ['font_table_small', 'assets/font_small/font.png'],
            ['font_table_medium', 'assets/font_medium/font.png'],
            ['font_table_large', 'assets/font_large/font.png']
        ]        
    );
}

function create() {
    gameInstance.phaserGame.physics.startSystem(Phaser.Physics.ARCADE);
    gameInstance.cDepth.depthGroup = gameInstance.phaserGame.add.group(undefined, undefined, true);

    gameInstance.phaserGame.state.add('testRoom', GameState, true);
}
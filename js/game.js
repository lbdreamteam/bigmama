/************ CLIENT ************/
/************ VARIABILI GLOBALI ************/
var myId = 0,
    ready = false,
    time,
    player;

var eurecaClientSetup = function () { //funzione richiamata dal create del gioco
    eurecaClient = new Eureca.Client();

    eurecaClient.ready(function (proxy) {
        eurecaServer = proxy;
    });

    /************ FUNZIONI DISPONIBILI LATO SERVER ************/
    eurecaClient.exports.createGame = function (id, x, y) {
        myId = id;
        create(x, y);
        ready = true;
        gameInstance.otherPlayersW.postMessage({ event: 'init', params: myId }); //inizializza il worker
    }

    eurecaClient.exports.updatePlayer = function (x, y, callId) {
        player.updatePosition(x, y, callId);
    };

    eurecaClient.exports.updateOtherPlayers = function (posTable) {
        OtherPlayersManager.Update(posTable);
    };

    eurecaClient.exports.onOtherPlayerConnect = function (id, x, y) {
        OtherPlayersManager.OnConnect(id, x, y);
    };

    eurecaClient.exports.onOtherPlayerDisconnect = function (id) {
        OtherPlayersManager.OnDisconnect(id);
    };

    eurecaClient.exports.spawnOtherPlayers = function (posTable) {
        OtherPlayersManager.Spawn(posTable);
    };
}


//GIOCO
 gameInstance = new LBGame(800, 600, 32, true, Phaser.AUTO, '', { preload: preload, create: eurecaClientSetup });

function preload() {
    gameInstance.loadImage('player', 'assets/player.png');
    gameInstance.loadImage('tree', 'assets/tree.png');
}

function create(x, y) {

    gameInstance.phaserGame.stage.backgroundColor = '#1B7B0C';
    gameInstance.depthGroup = gameInstance.phaserGame.add.group();

    tree = new TestingTree(gameInstance, 70, 120, 'tree');
    tree2 = new TestingTree(gameInstance, 600, 310, 'tree');
    tree3 = new TestingTree(gameInstance, 450, 200, 'tree');
    tree4 = new TestingTree(gameInstance, 390, 32, 'tree');
    tree5 = new TestingTree(gameInstance, 650, 64, 'tree');
    tree6 = new TestingTree(gameInstance, 100, 300, 'tree');
    tree7 = new TestingTree(gameInstance, 140, 20, 'tree');
    tree8 = new TestingTree(gameInstance, 230, 200, 'tree');
    tree9 = new TestingTree(gameInstance, 400, 280, 'tree');
    player = new LBPlayer(gameInstance, x, y, 'player', myId, eurecaServer, eurecaClient);
    depthSort(gameInstance);       

    gameInstance.clientsList[myId] = player;
}
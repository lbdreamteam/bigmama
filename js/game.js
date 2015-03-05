/************ CLIENT ************/
/************ VARIABILI GLOBALI ************/
var eurecaServer,
    myId = 0,
    ready = false,
    clientsList,
    time,
    eurecaClient,
    otherPlayers = new LBHashTable();

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
    }

    //eurecaClient.exports.UpdatePosition = player.updatePosition(x, y, callId);

    eurecaClient.exports.updatePlayer = function (x, y, callId) {
        player.updatePosition(x, y, callId);
    };

    eurecaClient.exports.updateOtherPlayers = function (positionsTable) {
        OtherPlayersManager.Update(positionsTable);
        //for (var client in positionsTable) {
        //    if (client != myId) {
        //        //otherPlayers.setItem(client, positionsTable[client]);
        //        //var tween = clientsList[client].game.add.tween(clientsList[client]).to({ x: positionsTable[client].state.x, y: positionsTable[client].state.y }, 100, Phaser.Easing.Linear.None, false, 0, 0, false);
        //        //tween.start();
        //        if (!clientsList[client].isMoving) {
        //            clientsList[client].createTween(clientsList[client], { x: positionsTable[client].state.x, y: positionsTable[client].state.y }, null, null, null, 175, Phaser.Easing.Linear.None);
        //        }
        //        //clientsList[client].x = positionsTable[client].state.x;
        //        //clientsList[client].y = positionsTable[client].state.y;
        //    }
        //}
    };

    eurecaClient.exports.onOtherPlayerConnect = function (id, x, y) {
        OtherPlayersManager.OnConnect(id, x, y);
        //otherPlayers.setItem(id, { x: x, y: y });
        //clientsList[id] = new OtherPlayer(gameInstance, x, y, 'player', id);        
    };

    eurecaClient.exports.onOtherPlayerDisconnect = function (id) {
        OtherPlayersManager.OnDisconnect(id);
        //otherPlayers.removeItem(id);
        //clientsList[id].kill();
    };

    eurecaClient.exports.spawnOtherPlayers = function (positionsTable) {
        OtherPlayersManager.Spawn(positionsTable);
        //for (var client in positionsTable) {
        //    if (client != myId) {
        //        alert(client);
        //        //otherPlayers.setItem(client, positionsTable[client]);
        //        clientsList[client] = new OtherPlayer(gameInstance, positionsTable[client].state.x, positionsTable[client].state.y, 'player', client);
        //    }
        //}
    };
}


//GIOCO
var gameInstance = new LBGame(800, 600, 32, true, Phaser.AUTO, '', { preload: preload, create: eurecaClientSetup }),
    player;

function preload() {
    gameInstance.loadImage('player', 'assets/player.png');
    gameInstance.loadImage('tree', 'assets/tree.png');
}

function create(x, y) {
    clientsList = {};

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

    clientsList[myId] = player;
}
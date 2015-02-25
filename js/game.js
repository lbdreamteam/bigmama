/************ CLIENT ************/
/************ VARIABILI GLOBALI ************/
var eurecaServer,
    myId = 0,
    ready = false,
    clientsList,
    time,
    eurecaClient,
    otherPlayers = new HashTable();

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
    loadImage(gameInstance, 'player', 'assets/bullet.png');
    loadImage(gameInstance, 'tree', 'assets/tree.png');
}

function create(x, y) {
    clientsList = {};

    gameInstance.depthGroup = gameInstance.phaserGame.add.group();

    tree = new TestingTree(gameInstance, 70, 120, 'tree');
    tree2 = new TestingTree(gameInstance, 600, 310, 'tree');
    tree3 = new TestingTree(gameInstance, 70, 160, 'player');
    player = new Player(gameInstance, x, y, 'player', myId, eurecaServer, eurecaClient);
   
    clientsList[myId] = player;
}
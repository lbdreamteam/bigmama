var positions = {},
    myId = 0;

self.addEventListener('message', function (e) {
    var data = e.data;
    switch (data.event) {
        case 'init': onInit(data.params); break;
        case 'connect': onConnect(data.params); break;
        case 'disconnect': onDisconnect(data.params); break;
        case 'update': update(data.params); break;
        case 'startMoving': toggleMoving(data.params, true); break;
        case 'requestPosition': onRequestPosition(data.params); break;
    }
}, false);

var onInit = function (params) {
    myId = params;
    movementGridSize = params.movementGridSize;
    self.postMessage({
        event: 'onInit',
        message: 'Worker Initialized: ', params
    });
};

var onConnect = function (params) {
    if (!params.id || !params.oldPos || !params.nowPos) self.postMessage({
        message: 'ERROR at onConnect: params are not correct'
    });
    else {
        positions[params.id] = { counter: 0, isPending: false, isMoving: false, pendingPositions: {}, lastPosition: { id: 0, x: params.oldPos.Tx, y: params.oldPos.Ty } };
        positions[params.id].counter++;
        positions[params.id].isPending = true;
        positions[params.id].pendingPositions[1] = { id: 1, x: params.nowPos.Tx, y: params.nowPos.Ty };
        self.postMessage({
            message: 'New Client: ' + params.id + ' -- OldPos(tiled): ' + params.oldPos.Tx + ';' + params.oldPos.Ty + ' -- NowPos(tiled): ' + params.nowPos.Tx + ';' + params.nowPos.Ty
        });
        onRequestPosition(params.id); // forza l'inizio di un tween tra la posizione iniziale e quella già conosciuta;
    }
};

var onDisconnect = function (params) {
    if (!params) self.postMessage({
        message: 'ERROR at onDisconnect: params.id is null or undefined'
    });
    else delete positions[params];
};

var update = function (params) {
    if (!params) self.postMessage({
        message: 'ERROR at update: nowPos is null or undefined'
    });
    else {
        var positionsUpdateTable = params;
        for (var client in positionsUpdateTable) {
            if (client != myId) {
                if (!positions[client].isPending) {
                    if (positions[client].lastPosition.x != positionsUpdateTable[client].x || positions[client].lastPosition.y != positionsUpdateTable[client].y) {
                        positions[client].counter++;
                        if (!positions[client].isMoving) {
                            positions[client].lastPosition = { id: positions[client].counter, x: positionsUpdateTable[client].x, y: positionsUpdateTable[client].y };
                            self.postMessage({
                                event: 'pushPosition',
                                params: { client: client, pointer: { x: positionsUpdateTable[client].x, y: positionsUpdateTable[client].y } },
                                message: '->PUSHING NEW<- Pushing new positions -- New counter: ' + positions[client].counter + ' -- New last positions: id: ' + positions[client].lastPosition.id + '; x: ' + positions[client].lastPosition.x + '; y: ' + positions[client].lastPosition.y
                            });
                        }
                        else {
                            positions[client].pendingPositions[positions[client].counter] = { id: positions[client].counter, x: positionsUpdateTable[client].x, y: positionsUpdateTable[client].y };
                            self.postMessage({
                                message: '->RECEIVED WHILE MOVING<- --New counter: ' + positions[client].counter + '-- New PendingPosition : id: ' + positions[client].counter + '; x: ' + positionsUpdateTable[client].x + '; y: ' + positionsUpdateTable[client].y
                            });
                            positions[client].isPending = true;
                        }
                    }
                }
                else if (positions[client].pendingPositions[positions[client].counter].x != positionsUpdateTable[client].x || positions[client].pendingPositions[positions[client].counter].y != positionsUpdateTable[client].y) {
                    positions[client].counter++;
                    positions[client].pendingPositions[positions[client].counter] = { id: positions[client].counter, x: positionsUpdateTable[client].x, y: positionsUpdateTable[client].y };
                    self.postMessage({
                        message: '->RECEIVED WHILE PENDING<- --New counter: ' + positions[client].counter + ' -- New PendingPosition : id: ' + positions[client].counter + '; x: ' + positionsUpdateTable[client].x + '; y: ' + positionsUpdateTable[client].y
                    });
                }
            }
        }
    }
};

var toggleMoving = function (id, state) {
    positions[id].isMoving = state;
};

var onRequestPosition = function (id) {
    if (positions[id].isMoving) toggleMoving(id, false);
    if (positions[id].isPending) {
        var newPosCounter = positions[id].lastPosition.id + 1;
        self.postMessage({
            event: 'pushPosition',
            params: {
                client: id, pointer: { x: positions[id].pendingPositions[newPosCounter].x, y: positions[id].pendingPositions[newPosCounter].y },
            },
            message: '->EXTRACTED FROM PENDINGS<- --New last positions: id: ' + newPosCounter + '; x: ' + positions[id].newPosCounter.x + '; y: ' + positions[id].newPosCounter.y
        });
        positions[id].lastPosition.id++;
        positions[id].lastPosition.x = positions[id].pendingPositions[positions[id].lastPosition.id].x;
        positions[id].lastPosition.y = positions[id].pendingPositions[positions[id].lastPosition.id].y;
        delete positions[id].pendingPositions[newPosCounter];
        if (positions[id].lastPosition.id == positions[id].counter) positions[id].isPending = false;
    }
};
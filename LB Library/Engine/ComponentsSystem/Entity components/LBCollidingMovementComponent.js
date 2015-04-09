LBCollidingMovementComponent = function (agent, h, moving, type, graph, leftOffset, rightOffset) {
    if (!agent.currentTile) {
        console.error('The Entity does not support this component --LBCollidingMovementComponent');
        return;
    }
    moving = moving || false;
    h = h || 1;
    if (agent.graph) graph = agent.graph;
    else if (!graph) {
        console.error('Error at --LBCollidingMovementComponent: graph is undefined');
        return;
    };

    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.CollidingMovement);

    gameInstance.phaserGame.physics.arcade.enable(agent);
    console.log(gameInstance.spritePixelMatrix);
    var width = gameInstance.spritePixelMatrix[graph].bottomright.x,
        height = gameInstance.spritePixelMatrix[graph].bottomright.y,
        G = agent.anchor.x * width,
        maxLeftD = maxRightD = 0,
        XLeftLimit = G - (gameInstance.movementGridSize / 2),
        XRightLimit = G + (gameInstance.movementGridSize / 2);
    for (var i = 0; i < XLeftLimit; i++) {
        if (!gameInstance.spritePixelMatrix[graph].matrix[i]) break;
        for (var j = height - 1; j > height - 1 - ((gameInstance.movementGridSize * h) - (gameInstance.movementGridSize / 2)) - ((1 - agent.anchor.y) * height) ; j--) {
            if (gameInstance.spritePixelMatrix[graph].matrix[i][j] == 1) {
                var currentD = G - i;
                if (currentD > maxLeftD) maxLeftD = currentD;
            }
        }
    }
    for (var i = XRightLimit - 1; i < gameInstance.spritePixelMatrix[graph].bottomright.x; i++) {
        if (!gameInstance.spritePixelMatrix[graph].matrix[i]) break;
        for (var j = height - 1; j > height - 1 - ((gameInstance.movementGridSize * h) - (gameInstance.movementGridSize / 2)) - ((1 - agent.anchor.y) * height) ; j--) {
            if (gameInstance.spritePixelMatrix[graph].matrix[i][j] == 1) {
                var currentD = i - G;
                if (currentD > maxRightD) maxRightD = currentD;
            }
        }
    }
    var minT = (maxLeftD != 0) ? Math.floor(((gameInstance.movementGridSize * agent.currentTile.x) - (gameInstance.movementGridSize / 2) - maxLeftD) / gameInstance.movementGridSize) + 1 : agent.currentTile.x,
        maxT = (maxRightD != 0) ? Math.floor(((gameInstance.movementGridSize * agent.currentTile.x) - (gameInstance.movementGridSize / 2) + maxRightD) / gameInstance.movementGridSize) + 1 : agent.currentTile.x,
        deltaT = maxT - minT + 1;




    //OLD VERSION
    //var width = gameInstance.phaserGame.cache.getImage(graph).width,
    //    minT = Math.floor(((agent.currentTile.x * gameInstance.movementGridSize) - (gameInstance.movementGridSize / 2) - agent.anchor.x * width) / gameInstance.movementGridSize) + 1,
    //    euristic = (agent.currentTile.x * gameInstance.movementGridSize) - (gameInstance.movementGridSize / 2) + (1- agent.anchor.x) * width,
    //    maxT = (euristic % gameInstance.movementGridSize == 0) ? Math.floor(euristic / gameInstance.movementGridSize) : Math.floor(euristic / gameInstance.movementGridSize) + 1,
    //    deltaT = maxT - minT + 1;
    agent.body.setSize(deltaT * gameInstance.movementGridSize, h * gameInstance.movementGridSize);
    //agent.body.position = gameInstance.mapMovementMatrix[minT][agent.currentTile.y - h];
    var pos = gameInstance.mapMovementMatrix[minT][agent.currentTile.y - h + 1];
    agent.body.x = pos.x - (gameInstance.movementGridSize / 2);
    agent.body.y = pos.y - (gameInstance.movementGridSize / 2);
    agent.body.immovable = true;
    gameInstance.phaserGame.debug.body(agent);
    console.log('Result from cCollidingMovement for ' + agent.id + ' --Pos:' + agent.currentTile.x + ';' + agent.currentTile.y + ' --MinT: ' + minT + ' --MaxT: ' + maxT + ' --DeltaT: ' + deltaT);

    this.sendDelegate(LBLibrary.ComponentsTypes.Movement, 'startMoving', function () { console.log('This is the callback from Colliding Movement...'); });
}

LBCollidingMovementComponent.prototype = Object.create(LBBaseComponent.prototype);
LBCollidingMovementComponent.prototype.constructor = LBCollidingMovementComponent;
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

    //Props
    this.minT;
    this.h = h;
    this.deltaT;


    this.sendDelegate('endMoving', function (params) {
        this.translateOfVector(params['direction']);
    }.bind(this));

    this.init(graph);

    this.createParameters({'hitbox': {minT: this.minT, dim: {width: this.deltaT, height: this.h}}});
}

LBCollidingMovementComponent.prototype = Object.create(LBBaseComponent.prototype);
LBCollidingMovementComponent.prototype.constructor = LBCollidingMovementComponent;

LBCollidingMovementComponent.prototype.init = function (graph) {

    var width = gameInstance.spritePixelMatrix[graph].bottomright.x,
       height = gameInstance.spritePixelMatrix[graph].bottomright.y,
       G = this.agent.anchor.x * width,
       maxLeftD = maxRightD = 0,
       XLeftLimit = G - (gameInstance.movementGridSize / 2),
       XRightLimit = G + (gameInstance.movementGridSize / 2);
    for (var i = 0; i < XLeftLimit; i++) {
        if (!gameInstance.spritePixelMatrix[graph].matrix[i]) break;
        for (var j = height - 1; j > height - 1 - ((gameInstance.movementGridSize * h) - (gameInstance.movementGridSize / 2)) - ((1 - this.agent.anchor.y) * height) ; j--) {
            if (gameInstance.spritePixelMatrix[graph].matrix[i][j] == 1) {
                var currentD = G - i;
                if (currentD > maxLeftD) maxLeftD = currentD;
            }
        }
    }
    for (var i = XRightLimit - 1; i < gameInstance.spritePixelMatrix[graph].bottomright.x; i++) {
        if (!gameInstance.spritePixelMatrix[graph].matrix[i]) break;
        for (var j = height - 1; j > height - 1 - ((gameInstance.movementGridSize * h) - (gameInstance.movementGridSize / 2)) - ((1 - this.agent.anchor.y) * height) ; j--) {
            if (gameInstance.spritePixelMatrix[graph].matrix[i][j] == 1) {
                var currentD = i - G;
                if (currentD > maxRightD) maxRightD = currentD;
            }
        }
    }
    this.minT = (maxLeftD != 0) ? Math.floor(((gameInstance.movementGridSize * this.agent.currentTile.x) - (gameInstance.movementGridSize / 2) - maxLeftD) / gameInstance.movementGridSize) + 1 : this.agent.currentTile.x;
    var maxT = (maxRightD != 0) ? Math.floor(((gameInstance.movementGridSize * this.agent.currentTile.x) - (gameInstance.movementGridSize / 2) + maxRightD) / gameInstance.movementGridSize) + 1 : this.agent.currentTile.x;
    this.deltaT = maxT - this.minT;

    for (var i = this.minT; i <= maxT; i++) {
        console.log('i', i);
        for (var j = this.agent.currentTile.y; j < this.agent.currentTile.y + this.h; j++) {
            console.log('Setting ', i, j);
            gameInstance.mapMovementMatrix[i][j].weight = 0;
        }
    }
}

LBCollidingMovementComponent.prototype.translateX = function (X) {
    if (!X) return;
    var spriteH = this.agent.currentTile.y,
        startX = this.minT - (((-1 + X) / 2) * this.deltaT),
        translation = X * (this.deltaT + 1);
    for (var i = 0; i < this.h; i++) {
        var currentH = spriteH - i;
        gameInstance.mapMovementMatrix[startX][currentH].weight = 1;
        console.log('Old ' , gameInstance.mapMovementMatrix[startX][currentH]);
        gameInstance.mapMovementMatrix[startX + translation][currentH].weight = 0;
        console.log('Translated(X) ' + startX + ',' + currentH + ' to ' + (startX + translation) + ',' + currentH);
    }
    this.minT += X;
}

LBCollidingMovementComponent.prototype.translateY = function (Y) {
    if (!Y) return;
    var spriteX = this.agent.currentTile.x,
        translation = Y * this.h,
        startH = this.agent.currentTile.y + (((-1 + Y) / 2) * (this.h - 1));
    for (var i = 0; i <= this.deltaT; i++) {
        var currentX = spriteX + i;
        gameInstance.mapMovementMatrix[currentX][startH] = 1;
        gameInstance.mapMovementMatrix[currentX][startH + translation] = 0;
        console.log('Translated(Y) ' + currentX + ',' + startH + ' to ' + currentX + ',' + (startH + translation));
    }
}

LBCollidingMovementComponent.prototype.translateOfVector = function (vector) {
    console.log('Translating...' , this.agent);
    this.translateX(vector.x);
    this.translateY(vector.y);
    console.log('...finished translating.');
}
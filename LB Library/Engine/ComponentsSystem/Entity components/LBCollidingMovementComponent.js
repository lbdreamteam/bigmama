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


    this.sendDelegate('stopMoving', function (params) {
        //console.log(params.direction);
    })

    this.init(graph);
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
    this.deltaT = maxT - this.minT + 1;

    for (var i = this.minT; i <= maxT; i++) {
        console.log('i', i);
        for (var j = this.agent.currentTile.y; j < this.agent.currentTile.y + this.h; j++){
            console.log('Setting ', i, j);
            gameInstance.mapMovementMatrix[i][j].weight = 0;
    }   }
}
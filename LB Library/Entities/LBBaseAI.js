LBBaseAI = function (gameInstance, Tx, Ty, graph) {
    LBSprite.call(this, gameInstance, Tx, Ty, graph);

    this.cMovement = new LBMovementComponent(this);
    this.path = [];

    this.createIter();
}

LBBaseAI.prototype = Object.create(LBSprite.prototype);
LBBaseAI.prototype.constructor = LBBaseAI;

LBBaseAI.prototype.update = function () {

    if (this.path.length > 0) {
        if (!this.cMovement.isMoving) {
            this.cMovement.move(
                this.path[0],
                250,
                function (context) {
                    context.path.shift();
                    console.log(context.path);
                }
            );
        }
    }
    else {
        this.createIter();
    }
}

//Probabilmente da convertire in componente
LBBaseAI.prototype.createIter = function () {
    //TESTING A*
    //TODO: controllare mapMovementGrid 1 based anzichè 0 based
    //TODO: ci sono dei problemi con mapMovementGrid legati al fatto che è y x e non x y!
    var tempGrid = [];

    for (var i = 1; i < gameInstance.mapMovementMatrix.length; i++) {
        tempGrid[i] = [];
        for (var j = 1; j < gameInstance.mapMovementMatrix[i].length; j++) {
            tempGrid[i][j] = gameInstance.mapMovementMatrix[i][j].weight;
        }
    }

    console.log(tempGrid);
    var graph = new Graph(tempGrid);

    var start = graph.grid[this.currentTile.x][this.currentTile.y];
    var end = graph.grid[gameInstance.clientsList[myId].currentTile.x][gameInstance.clientsList[myId].currentTile.y];
    var result = astar.search(graph, start, end);

    console.log(result);

    for (var i = 0; i < result.length; i++) {
        this.path.push(result[i]);
    }

    console.log(this.path);
    //Fine Testing A*
}
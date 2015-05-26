LBBaseAI = function (gameInstance, Tx, Ty, graph) {
    LBSprite.call(this, gameInstance, Tx, Ty, graph);

    this.cMovement = new LBMovementComponent(this);
    this.cSnapping = new LBSnappingComponent(this);
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

    for (var i = 0; i < gameInstance.mapMovementMatrix.length; i++) {
        tempGrid[i] = [];
        for (var j = 0; j < gameInstance.mapMovementMatrix[i].length; j++) {
            tempGrid[i][j] = gameInstance.mapMovementMatrix[i][j].weight;
        }
    }

    //for (var row = 0; row < gameInstance.mapMovementMatrix.length; row++) {
    //    //tempGrid[row] = [];
    //    for (var column = 0; column < gameInstance.mapMovementMatrix[row].length; column++) {
    //        //tempGrid[row][column] = gameInstance.mapMovementMatrix[row][column].weight;
    //        tempGrid[column] = [];
    //        for (var row2 = 0; row2 < gameInstance.mapMovementMatrix.length; row2++) {
    //            tempGrid[column][row2] = gameInstance.mapMovementMatrix[row2][column].weight;
    //        }
    //    }
    //}

    console.log(tempGrid);
    var graph = new Graph(tempGrid);

    var start = graph.grid[2][2];
    var end = graph.grid[3][4];
    var result = astar.search(graph, start, end);

    console.log(result);

    for (var i = 0; i < result.length; i++) {
        this.path.push(result[i]);
    }

    console.log(this.path);
    //Fine Testing A*
}
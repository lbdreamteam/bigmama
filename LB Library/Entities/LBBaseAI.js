LBBaseAI = function (gameInstance, Tx, Ty, graph) {
    LBSprite.call(this, gameInstance, Tx, Ty, graph);

    this.cMovement = new LBMovementComponent(this);
    this.cSnapping = new LBSnappingComponent(this);
    this.path = [];
}

LBBaseAI.prototype = Object.create(LBSprite.prototype);
LBBaseAI.prototype.constructor = LBBaseAI;

LBBaseAI.prototype.update = function () {

    //Qualche volta vi è un errore con le y (sovrapposizione)
    //TODO: fare in modo che ricalcoli il percorso una volta arrivato ad una certa percentuale di quello vecchio

    this.createIter();
    if (this.path.length > 0) {
        if (!this.cMovement.isMoving) {
            console.log(this.currentTile);
            console.log(gameInstance.clientsList[myId].currentTile);
            console.log('PATH: ');
            console.log(this.path);
            this.cMovement.move(
                this.path[0],
                250,
                function () {},
                function (context) {
                    context.path.shift();
                }
            );
        }
    }
}

//Probabilmente da convertire in componente
LBBaseAI.prototype.createIter = function () {
    //TESTING A*
    var tempGrid = [];

    for (var row = 0; row < gameInstance.mapMovementMatrix.length; row++) {
        for (var column = 0; column < gameInstance.mapMovementMatrix[row].length; column++) {
            tempGrid[column] = [];
            for (var row2 = 0; row2 < gameInstance.mapMovementMatrix.length; row2++) {
                tempGrid[column][row2] = gameInstance.mapMovementMatrix[row2][column].weight;
            }
        }
    }

    var graph = new Graph(tempGrid, {diagonal: true});
    var start = graph.grid[this.currentTile.x][this.currentTile.y];
    var end = graph.grid[gameInstance.clientsList[myId].currentTile.x][gameInstance.clientsList[myId].currentTile.y];
    this.path = astar.search(graph, start, end);

    //Fine Testing A*
}
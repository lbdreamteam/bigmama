LBPathFindingComponent = function (agent, algorithm) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.PathFinding);

    this.algorithm = algorithm || 'A*';
    this.increment;
    this.path = [];

    this.createParameters({ 'direction': this.increment });
    this.sendUpdate(
            this.update.bind(this),
            [],
            ['direction']
        );
}

LBPathFindingComponent.prototype = Object.create(LBBaseComponent.prototype);
LBPathFindingComponent.prototype.constructor = LBPathFindingComponent;

LBPathFindingComponent.prototype.update = function () {
    if (this.path.length > 0) {
        if (!this.cMovement.isMoving) {
            this.createIter();
            console.log('PATH: ', this.path);
            if (this.path.length != 0)
                this.cMovement.move(
                    this.path[0],
                    250,
                    function () { },
                    function (context) {
                        context.path.shift();
                    }
                );
        }
    }
    else this.createIter();
};

LBPathFindingComponent.prototype.createIter = function () {
    var weightMap = [];
    for (var iRow in gameInstance.mapMovementMatrix) {
        weightMap[iRow] = [];
        for (var iColumn in gameInstance.mapMovementMatrix[iRow]) weightMap[iRow].push(gameInstance.mapMovementMatrix[iRow][iColumn].weight);
    }
    var graph = new Graph(weightMap, { diagonal: true });
    var start = graph.grid[this.currentTile.x][this.currentTile.y];
    var end = graph.grid[gameInstance.clientsList[myId].currentTile.x - 1][gameInstance.clientsList[myId].currentTile.y];
    this.path = astar.search(graph, start, end);
}
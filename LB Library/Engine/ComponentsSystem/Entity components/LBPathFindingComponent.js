LBPathFindingComponent = function (agent, algorithm) {
    LBBaseComponent.call(this, agent);

    this.algorithm = algorithm || 'A*';
    this.increment;
    this.path = [];

    this.createParameters({ 'direction': this.increment });

    this.init()
}

LBPathFindingComponent.prototype = Object.create(Object);
LBPathFindingComponent.prototype.constructor = LBPathFindingComponent;

LBPathFindingComponent.prototype.init = function () {
    this.sendUpdate(function () {
        if (this.path.length > 0) {
            if (!this.cMovement.isMoving) {
                this.createIter();
                console.log(this.currentTile);
                console.log(gameInstance.clientsList[myId].currentTile);
                console.log('PATH: ');
                console.log(this.path);
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
    }.bind(this), [], ['direction']);
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
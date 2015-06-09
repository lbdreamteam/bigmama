LBPathFindingComponent = function (agent, algorithm) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.PathFinding);

    this.algorithm = algorithm || 'A*';
    this.increment = { x: 0 , y: 0 };
    this.path = [];

    //Se non esiste un MovementComponent sull'agent lo aggiunge
    if (!this.componentsManager.Components[LBLibrary.ComponentsTypes.Movement])
        this.agent.cMovement = new LBMovementComponent(this.agent);
    this.cMovement = this.componentsManager.Components[LBLibrary.ComponentsTypes.Movement];

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
        if (!this.componentsManager.Parameters['isMoving']) {
            this.createIter();
            //console.log('PATH: ', this.path);
            if (this.path.length != 0) {
                this.increment = {
                    x: this.path[0].x - this.agent.currentTile.x,
                    y: this.path[0].y - this.agent.currentTile.y
                };
                this.updateParam('direction', this.increment);
                this.cMovement.move(
                    this.path[0],
                    250,
                    function () { },
                    function () {
                        this.path.shift();
                    }.bind(this)
                );
            }
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
    var start = graph.grid[this.agent.currentTile.x][this.agent.currentTile.y];
    var end = graph.grid[gameInstance.clientsList[myId].currentTile.x - 1][gameInstance.clientsList[myId].currentTile.y];
    this.path = astar.search(graph, start, end);
}
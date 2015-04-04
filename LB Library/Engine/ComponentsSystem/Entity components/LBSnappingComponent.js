LBSnappingComponent = function (agent, graph, yG, offX) {
    if (agent.graph && !graph) graph = agent.graph;
    else if (!agent.graph && !graph) {
        console.error('Error at --LBSnappingComponent: graph is undefined');
        return;
    }
    yG = yG || gameInstance.movementGridSize / 2;
    offX = offX || 0;
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.Snapping);
    this.setAnchor(graph, yG, offX);
}

LBSnappingComponent.prototype = Object.create(LBBaseComponent.prototype);
LBSnappingComponent.prototype.constructor = LBSnappingComponent;

LBSnappingComponent.prototype.setAnchor = function (graph, yG, offX) {
    if (typeof offY === 'undefined' || !offY) offY = 0;
    var imgY = gameInstance.phaserGame.cache.getImage(graph).height;
    console.log('imgY: ' + imgY);
    if (1 - (yG / imgY) > 1 || 1 - (yG / imgY) < 0 || 0.5 + (offX / imgY) > 1 || 0.5 + (offX / imgY) < 0)
    {
        console.error('Error at SnappingComponent: values are not correct.');
    }
    this.agent.anchor.set(0.5 + (offX / imgY), 1 - (yG / imgY));
    console.log('Anchor set for object: ' + this.agent.id + ' --At (' + this.agent.anchor.x + ';' + this.agent.anchor.y + ')');
}
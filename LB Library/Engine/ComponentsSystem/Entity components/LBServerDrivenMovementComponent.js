LBServerDrivenMovementComponent = function (agent) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.ServerDrivenMovement);
    if (typeof (this.agent.cMovement) === 'undefined') this.cMovement = new LBMovementComponent(this.agent);
    
    //PROPS
    this.increment = { x: 0, y: 0 };

    this.createParameters({ 'direction': this.increment });
}

LBServerDrivenMovementComponent.prototype = Object.create(LBBaseComponent.prototype);
LBServerDrivenMovementComponent.prototype.constructor = LBServerDrivenMovementComponent;

LBServerDrivenMovementComponent.prototype.onPushPosition = function (params) {
    this.increment.x = params.pointer.x - this.agent.currentTile.x;
    this.increment.y = params.pointer.y - this.agent.currentTile.y;

    this.updateParam('direction', this.increment);

    this.agent.cMovement.move(
        { x: params.pointer.x, y: params.pointer.y },
        175,
        function (_agent, input) {
            gameInstance.otherPlayersW.worker.postMessage({ event: 'startMoving', params: params.client });
        },
        function (_agent) {
            //console.log('WorkerModule:  New currentTile for ' + params.client + ' --Values: ' + params.pointer.x + ';' + params.pointer.y + ' --Pixels: ' + gameInstance.clientsList[params.client].x + ';' + gameInstance.clientsList[params.client].y);
            gameInstance.otherPlayersW.worker.postMessage({ event: 'requestPosition', params: params.client });
        },
        null,
        Phaser.Easing.Linear.None,
        false);
}
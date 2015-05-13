LBShootableComponent = function (agent, direction, speed) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.Shootable);
    this.direction = direction;
    this.duration = Math.floor(1000/speed);
    if (!this.componentsManager.Components[LBLibrary.ComponentsTypes.Movement])
        this.agent.cMovement = new LBMovementComponent(this.agent);
    this.cMovement = this.componentsManager.Components[LBLibrary.ComponentsTypes.Movement];

    this.move({ x: this.agent.currentTile.x + this.direction.x,
                y: this.agent.currentTile.y + this.direction.y });
}

LBShootableComponent.prototype = Object.create(LBBaseComponent.prototype);
LBShootableComponent.prototype.constructor = LBShootableComponent;

LBShootableComponent.prototype.move = function (target) {
    this.cMovement.move(
        target,
        undefined,
        function () {
            this.move({ x: target.x + this.direction.x,
                        y: target.y + this.direction.y})}.bind(this),
        this.direction,
        this.duration,
        Phaser.Easing.Linear.None
    );
}
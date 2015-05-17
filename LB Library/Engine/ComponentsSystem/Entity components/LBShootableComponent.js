LBShootableComponent = function (agent, facing, speed, range) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.Shootable);
    this.direction = this.convertFacing(facing);
    this.duration = Math.floor(1000 / speed);
    if (!this.componentsManager.Components[LBLibrary.ComponentsTypes.Movement])
        this.agent.cMovement = new LBMovementComponent(this.agent);
    this.cMovement = this.componentsManager.Components[LBLibrary.ComponentsTypes.Movement];
    this.sendDelegate('outOfMap', function () { this.agent.kill(); }.bind(this));

    this.move({
        x: this.agent.currentTile.x + this.direction.x,
        y: this.agent.currentTile.y + this.direction.y
    }, range);
}

LBShootableComponent.prototype = Object.create(LBBaseComponent.prototype);
LBShootableComponent.prototype.constructor = LBShootableComponent;

LBShootableComponent.prototype.move = function (target, repetitions) {
    this.cMovement.move(
        target,
        undefined,
        function () {
            if (repetitions > 0)
                this.move({
                    x: target.x + this.direction.x,
                    y: target.y + this.direction.y
                }, repetitions - 1)
            else
                this.agent.kill();
        }.bind(this),
        this.direction,
        this.duration,
        Phaser.Easing.Linear.None
    );
}

LBShootableComponent.prototype.convertFacing = function (facing) {
    var result = { x: 0, y: 0 };
    switch (facing) {
        case "UP": result.y = -1;
            break;
        case "DOWN": result.y = 1;
            break;
        case "LEFT": result.x = -1;
            break;
        case "RIGHT": result.x = 1;
            break;
        case "UP-LEFT": result.x = -1;
            result.y = -1;
            break;
        case "UP-RIGHT": result.x = 1;
            result.y = -1;
            break;
        case "DOWN-LEFT": result.x = -1;
            result.y = 1;
            break;
        case "DOWN-RIGHT": result.x = 1;
            result.y = 1;
            break;
    }
    return result;
}
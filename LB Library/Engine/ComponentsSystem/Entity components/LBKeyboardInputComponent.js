LBKeyboardInputComponent = function (agent) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.KeyboardInput);

    this.targetPoint = { x: agent.x, y: agent.y };
    this.inputString = null;
    this.increment = { x: 0, y: 0 };
    this.cursors = gameInstance.phaserGame.input.keyboard.createCursorKeys();

    if (!this.componentsManager.Components[LBLibrary.ComponentsTypes.Movement])
        this.agent.cMovement = new LBMovementComponent(this.agent);
    this.cMovement = this.componentsManager.Components[LBLibrary.ComponentsTypes.Movement];

    this.isGridEnabled = gameInstance.mapMovementMatrix ? true : false;
    this.createParameters( { direction: this.increment } );
    this.sendUpdate( this.update.bind(this), [], ['direction']);
}

LBKeyboardInputComponent.prototype = Object.create(LBBaseComponent.prototype);
LBKeyboardInputComponent.prototype.constructor = LBKeyboardInputComponent;

LBKeyboardInputComponent.prototype.detectInput = function (cursors) {

    this.increment = { x: 0, y: 0 };

    this.inputString = this.createInputString(this.agent, cursors)

    if (this.inputString != 'null') {

        this.increment = this.switchFunction(this.inputString);

        this.targetPoint = { x: this.agent.currentTile.x + this.increment.x, y: this.agent.currentTile.y + this.increment.y };
    }

    this.componentsManager.Parameters['direction'] = this.increment;

    return this.inputString;
}

LBKeyboardInputComponent.prototype.createInputString = function(agent, cursors) {
    var input;

    if (cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown && !cursors.left.isDown) {
        input = 'up';
        this.agent.facing = 'UP';
    }
    else if (!cursors.up.isDown && cursors.down.isDown && !cursors.right.isDown && !cursors.left.isDown) {
        input = 'down';
        this.agent.facing = 'DOWN';
    }
    else if (!cursors.up.isDown && !cursors.down.isDown && cursors.right.isDown && !cursors.left.isDown) {
        input = 'right';
        this.agent.facing = 'RIGHT';
    }
    else if (!cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown && cursors.left.isDown) {
        input = 'left';
        this.agent.facing = 'LEFT';
    }
    else if (gameInstance.movementInEightDirections && cursors.up.isDown && !cursors.down.isDown && cursors.right.isDown && !cursors.left.isDown) {
        input = 'up-right';
        this.agent.facing = 'UP-RIGHT';
    }
    else if (gameInstance.movementInEightDirections && cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown && cursors.left.isDown) {
        input = 'up-left';
        this.agent.facing = 'UP-LEFT';
    }
    else if (gameInstance.movementInEightDirections && !cursors.up.isDown && cursors.down.isDown && cursors.right.isDown && !cursors.left.isDown) {
        input = 'down-right';
        this.agent.facing = 'DOWN-RIGHT';
    }
    else if (gameInstance.movementInEightDirections && !cursors.up.isDown && cursors.down.isDown && !cursors.right.isDown && cursors.left.isDown) {
        input = 'down-left';
        this.agent.facing = 'DOWN-LEFT';
    }
    else {
        input = 'null';
    }

    return input;
}

LBKeyboardInputComponent.prototype.switchFunction = function(input) {

    var increment = { x: 0, y: 0 };

    switch (input) {
        case 'up':
            increment.y--;
            break;
        case 'down':
            increment.y++;
            break;
        case 'right':
            increment.x++;
            break;
        case 'left':
            increment.x--;
            break;
        case 'up-right':
            increment.x++;
            increment.y--;
            break;
        case 'up-left':
            increment.x--;
            increment.y--;
            break;
        case 'down-right':
            increment.x++;
            increment.y++;
            break;
        case 'down-left':
            increment.x--;
            increment.y++;
            break;
        case 'null':
            break;
        default:
            alert('Qualcosa non ha funzionato nel rilevare l input');
            break;
    }

    //console.log('map: ' + gameInstance.mapMovementMatrix[this.agent.currentTile.x + increment.x][this.agent.currentTile.y + increment.y])
    if (this.isGridEnabled && !gameInstance.mapMovementMatrix[this.agent.currentTile.y + increment.y]) increment = { x: 0, y: 0 }
    else if (this.isGridEnabled && !gameInstance.mapMovementMatrix[this.agent.currentTile.y + increment.y][this.agent.currentTile.x + increment.x]) increment = { x: 0, y: 0 };
    //console.log(increment);
    return increment;
}

LBKeyboardInputComponent.prototype.update = function () {
    if (!this.componentsManager.Parameters['isMoving']) {
        if (this.detectInput(this.cursors) != 'null' && (this.increment.x != 0 || this.increment.y != 0)) {
            this.cMovement.move(
                this.targetPoint,
                175,
                function (context, increment) {
                    if (context.calls.counter >= 2500) context.calls.counter = 0;
                    context.calls.counter++;
                    context.calls.calls.setItem(context.calls.counter, { id: context.calls.counter, input: context.cKeyboardInput.inputString });

                    eurecaServer.clientHandler({ event: 'sendInput', params: { increment: increment, clientId: myId, callId: context.calls.counter } });
                    if (gameInstance.overlap) context.cOverlap.findCollidableObject(context.increment);
                },
                function (context) {
                    if (gameInstance.overlap && context.cOverlap) context.cOverlap.checkOverlap(true);
                },
                this.increment,
                Phaser.Easing.Linear.None
           );
        };
    }
}
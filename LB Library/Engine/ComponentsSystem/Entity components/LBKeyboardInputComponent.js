LBKeyboardInputComponent = function (agent) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.KeyboardInput);

    this.targetPoint = { x: agent.x, y: agent.y };
    this.inputString = null;
    this.increment = { x: 0, y: 0 };

    this.isGridEnabled = gameInstance.mapMovementMatrix ? true : false;
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
    return this.inputString;
}

LBKeyboardInputComponent.prototype.createInputString = function(agent, cursors) {
    var input;

    if (cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown && !cursors.left.isDown) {
        input = 'up';
    }
    else if (!cursors.up.isDown && cursors.down.isDown && !cursors.right.isDown && !cursors.left.isDown) {
        input = 'down';
    }
    else if (!cursors.up.isDown && !cursors.down.isDown && cursors.right.isDown && !cursors.left.isDown) {
        input = 'right';
    }
    else if (!cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown && cursors.left.isDown) {
        input = 'left';
    }
    else if (gameInstance.movementInEightDirections && cursors.up.isDown && !cursors.down.isDown && cursors.right.isDown && !cursors.left.isDown) {
        input = 'up-right';
    }
    else if (gameInstance.movementInEightDirections && cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown && cursors.left.isDown) {
        input = 'up-left';
    }
    else if (gameInstance.movementInEightDirections && !cursors.up.isDown && cursors.down.isDown && cursors.right.isDown && !cursors.left.isDown) {
        input = 'down-right';
    }
    else if (gameInstance.movementInEightDirections && !cursors.up.isDown && cursors.down.isDown && !cursors.right.isDown && cursors.left.isDown) {
        input = 'down-left';
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
    if (this.isGridEnabled && !gameInstance.mapMovementMatrix[this.agent.currentTile.x + increment.x]) increment = { x: 0, y: 0 }
    else if (this.isGridEnabled && !gameInstance.mapMovementMatrix[this.agent.currentTile.x + increment.x][this.agent.currentTile.y + increment.y]) increment = { x: 0, y: 0 };
    //console.log(increment);
    return increment;
}
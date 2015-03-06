LBKeyboardInputComponent = function (agent) {
    LBBaseComponent.call(this, agent);

    this.targetPointX = agent.x;
    this.targetPointY = agent.y;
    this.inputString = null;
    this.increment = { x: 0, y: 0 };
}

LBKeyboardInputComponent.prototype = Object.create(LBBaseComponent.prototype);
LBKeyboardInputComponent.prototype.constructor = LBKeyboardInputComponent;

LBKeyboardInputComponent.prototype.detectInput = function (cursors) {

    var component = this;

    this.inputString = createInputString(component.agent, cursors)

    if (this.inputString != 'null') {
        this.increment = switchFunction(this.inputString);

        if (this.increment.x) component.agent.currentTile.x += this.increment.x;
        if (this.increment.y) component.agent.currentTile.y += this.increment.y;

        this.targetPointX = (component.agent.currentTile.x * component.agent.gameInstance.movementGridSize) - (component.agent.gameInstance.movementGridSize / 2);
        this.targetPointY = (component.agent.currentTile.y * component.agent.gameInstance.movementGridSize) - (component.agent.gameInstance.movementGridSize / 2);

    }
}

function createInputString(agent, cursors) {
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
    else if (agent.gameInstance.movementInEightDirections && cursors.up.isDown && !cursors.down.isDown && cursors.right.isDown && !cursors.left.isDown) {
        input = 'up-right';
    }
    else if (agent.gameInstance.movementInEightDirections && cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown && cursors.left.isDown) {
        input = 'up-left';
    }
    else if (agent.gameInstance.movementInEightDirections && !cursors.up.isDown && cursors.down.isDown && cursors.right.isDown && !cursors.left.isDown) {
        input = 'down-right';
    }
    else if (agent.gameInstance.movementInEightDirections && !cursors.up.isDown && cursors.down.isDown && !cursors.right.isDown && cursors.left.isDown) {
        input = 'down-left';
    }
    else {
        input = 'null';
    }

    return input;
}

function switchFunction(input) {

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
    return increment;
}
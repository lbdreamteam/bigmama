Player = function (gameInstance, x, y, graph, id, eurecaServer, eurecaClient) {
    BaseCharacter.call(this, gameInstance, x, y, graph);

    //Proprietà
    this.id = id;
    this.connections = { server: eurecaServer, client: eurecaClient };
    this.calls = { counter: 0, calls: new HashTable() };
    this.cursors = gameInstance.phaserGame.input.keyboard.createCursorKeys();
    
    //Problemi da fixare: this.serverCalls = { calls: new HashTable(), callCounter: 0 };

    //Aggiunta dell'istanza al gioco
    gameInstance.phaserGame.add.existing(this);
    this.gameInstance.phaserGame.time.advancedTiming = true;

    coordinatesText = this.gameInstance.phaserGame.add.text(15, 30, "X: Y:", { font: "18px Arial", fill: "#333333" });
    fpsText = this.gameInstance.phaserGame.add.text(15, 60, 'FPS: ', { font: '18px Arial', fill: '#333333' });
}

var coordinatesText,
    fpsText;

Player.prototype = Object.create(BaseCharacter.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    fpsText.setText('FPS: ' + this.gameInstance.phaserGame.time.fps);
    coordinatesText.setText('X: ' + this.x + ' Y: ' + this.y);
    if (!this.isMoving) {

        var input = createInputString(this, this.cursors);

        if (input != 'null') {

            var increment = switchFunction(input);

            
            if (increment.x) this.currentTile.x += increment.x;
            if (increment.y) this.currentTile.y += increment.y;


            var pointer = { x: (this.currentTile.x * this.gameInstance.movementGridSize) - (this.gameInstance.movementGridSize / 2), y: (this.currentTile.y * this.gameInstance.movementGridSize) - (this.gameInstance.movementGridSize / 2) }; // il punto di arrivo

            this.createTween(
                this,
                pointer,
                function (character, input) {
                    if (character.calls.counter >= 2500) character.calls.counter = 0;
                    character.calls.counter++;
                    character.calls.calls.setItem(character.calls.counter, { id: character.calls.counter, input: input });
                    character.connections.server.ClientManagement.Player.SendInput(input, character.id, character.calls.counter);
                },
                null,
                input,
                175,
                Phaser.Easing.Linear.None
            );                
        }
    }
}

Player.prototype.updatePosition = function (x, y, callId) {
    
    var increment = { x: 0, y: 0 };

    this.calls.calls.removeItem(callId);
    this.calls.calls.each(function (key, item) {
        increment += switchFunction(item.input);
    });    

    if (x + increment.x * this.gameInstance.movementGridSize != (this.currentTile.x * this.gameInstance.movementGridSize) - (this.gameInstance.movementGridSize / 2))
        this.x = x + increment.x * this.gameInstance.movementGridSize;
    if (y + increment.y * this.gameInstance.movementGridSize != (this.currentTile.y * this.gameInstance.movementGridSize) - (this.gameInstance.movementGridSize / 2))
        this.y = y + increment.y * this.gameInstance.movementGridSize;

    coordinatesText.setText('X: ' + this.x + ' Y: ' + this.y);
}


function createInputString(player, cursors) {
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
    else if (player.gameInstance.movementInEightDirections && cursors.up.isDown && !cursors.down.isDown && cursors.right.isDown && !cursors.left.isDown) {
        input = 'up-right';
    }
    else if (player.gameInstance.movementInEightDirections && cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown && cursors.left.isDown) {
        input = 'up-left';
    }
    else if (player.gameInstance.movementInEightDirections && !cursors.up.isDown && cursors.down.isDown && cursors.right.isDown && !cursors.left.isDown) {
        input = 'down-right';
    }
    else if (player.gameInstance.movementInEightDirections && !cursors.up.isDown && cursors.down.isDown && !cursors.right.isDown && cursors.left.isDown) {
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


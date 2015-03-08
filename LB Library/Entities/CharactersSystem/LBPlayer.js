LBPlayer = function (gameInstance, x, y, graph, id, eurecaServer, eurecaClient) {
    LBBaseCharacter.call(this, gameInstance, x, y, graph, id, true);

    //Proprietà
    this.id = id;
    this.connections = { server: eurecaServer, client: eurecaClient };
    this.calls = { counter: 0, calls: new LBHashTable() };
    this.cursors = gameInstance.phaserGame.input.keyboard.createCursorKeys();
    
    //Problemi da fixare: this.serverCalls = { calls: new HashTable(), callCounter: 0 };

    //Aggiunta dell'istanza al gioco
    this.gameInstance.phaserGame.add.existing(this);
    this.gameInstance.phaserGame.time.advancedTiming = true;

    this.zDepth = 0.6;      //Così il player è sopra gli altri giocatori

    this.gameInstance.playerInstance = this;
    this.gameInstance.depthGroup.add(this);

    coordinatesText = this.gameInstance.phaserGame.add.text(15, 30, "X: Y:", { font: "18px Arial", fill: "#333333" });
    fpsText = this.gameInstance.phaserGame.add.text(15, 60, 'FPS: ', { font: '18px Arial', fill: '#333333' });

    this.cKeyboardInput = new LBKeyboardInputComponent(this);

}

var coordinatesText,
    fpsText;

LBPlayer.prototype = Object.create(LBBaseCharacter.prototype);
LBPlayer.prototype.constructor = LBPlayer;

LBPlayer.prototype.update = function () {

    fpsText.setText('FPS: ' + this.gameInstance.phaserGame.time.fps);
    coordinatesText.setText('X: ' + this.x + ' Y: ' + this.y);
    if (!this.cMovement.isMoving) {

        if (this.cKeyboardInput.detectInput(this.cursors) != 'null') {
            this.cMovement.move(
            { x: this.cKeyboardInput.targetPointX, y: this.cKeyboardInput.targetPointY },
            function (character, input) {
                if (character.calls.counter >= 2500) character.calls.counter = 0;
                character.calls.counter++;
                character.calls.calls.setItem(character.calls.counter, { id: character.calls.counter, input: input });
                character.connections.server.ClientManagement.Player.SendInput(input, character.id, character.calls.counter);
            },
            function (character) {
                overlapHandler(character, gameInstance, character.cKeyboardInput.increment);
            },
            this.cKeyboardInput.inputString,
            175,
            Phaser.Easing.Linear.None
            );
        };        
    }
    else {
        this.updateDisplayedName();
    }
}

LBPlayer.prototype.updatePosition = function (x, y, callId) {
    
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




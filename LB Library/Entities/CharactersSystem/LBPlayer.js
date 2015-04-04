LBPlayer = function (gameInstance, x, y, graph, id, eurecaServer, eurecaClient, width, height) {
    LBBaseCharacter.call(this, gameInstance, x, y, graph, id, true, width, height);

    //Proprietà
    this.id = id;
    this.calls = { counter: 0, calls: new LBHashTable() };
    this.cursors = gameInstance.phaserGame.input.keyboard.createCursorKeys();
    
    //Problemi da fixare: this.serverCalls = { calls: new HashTable(), callCounter: 0 };

    //Aggiunta dell'istanza al gioco
    this.gameInstance.phaserGame.add.existing(this);
    this.gameInstance.phaserGame.time.advancedTiming = true;

    this.zDepth = 0.6;      //Così il player è sopra gli altri giocatori

    this.gameInstance.playerInstance = this;
    this.gameInstance.cDepth.depthGroup.add(this);

    coordinatesText = this.gameInstance.phaserGame.add.text(15, 30, "X: Y:", { font: "18px Arial", fill: "#333333" });
    fpsText = this.gameInstance.phaserGame.add.text(15, 60, 'FPS: ', { font: '18px Arial', fill: '#333333' });

    coordinatesText.fixedToCamera = true;
    fpsText.fixedToCamera = true;

    this.cKeyboardInput = new LBKeyboardInputComponent(this);

    if (gameInstance.overlap)
        this.cOverlap = new LBOverlapComponent(this);
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
                eurecaServer.ClientManagement.Player.SendInput(input, character.id, character.calls.counter);
                if (gameInstance.overlap)
                    character.cOverlap.findCollidableObject(character.cKeyboardInput.increment);
            },
            function (character) {
                if (character.gameInstance.overlap)
                    character.cOverlap.checkOverlap(true);
            },
            this.cKeyboardInput.inputString,
            175,
            Phaser.Easing.Linear.None
            );
        };        
    }
    else {
        this.updateDisplayedName();
        if (this.cMovement.isMoving)
            this.cOverlap.checkOverlap(false);
    }
}

LBPlayer.prototype.updatePosition = function (x, y, callId) {
    
    var increment = { x: 0, y: 0 };

    this.calls.calls.removeItem(callId);
    this.calls.calls.each(function (key, item) {
        increment += switchFunction(item.input);
    });    

    if (x + increment.x != this.currentTile.x)
        this.x = x + increment.x * this.gameInstance.movementGridSize;
    if (y + increment.y != this.currentTile.y)
        this.y = y + increment.y * this.gameInstance.movementGridSize;

    coordinatesText.setText('X: ' + this.x + ' Y: ' + this.y);
}




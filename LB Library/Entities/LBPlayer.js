LBPlayer = function (gameInstance, Tx, Ty, graph) {
    LBSprite.call(this, gameInstance, Tx, Ty, graph);

    //Props
    this.calls = { counter: 0, calls: new LBHashTable() }; //--> DA RIVEDERE TUTTA LA RECONCILIATION <--
    //Controllo dello ZDepth
    this.zDepth = 0.6;
    //Componenti
    this.cSnapping = new LBSnappingComponent(this);
    this.cCollidingMovement = new LBCollidingMovementComponent(this);
    if (gameInstance.overlap) this.cOverlap = new LBOverlapComponent(this);
    this.cMovement = new LBMovementComponent(this);
    this.cKeyboardInput = new LBKeyboardInputComponent(this);
    this.cShooting = new LBShootingComponent(this);
    this.weapon = new LBWeapon('gun', 5, 12, 150, 150, 10, 'tree');
}

LBPlayer.prototype = Object.create(LBSprite.prototype);
LBPlayer.prototype.constructor = LBPlayer;

LBPlayer.prototype.update = function () {
    //da mettere sull'update dello shootingComponent
    if (gameInstance.phaserGame.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.weapon !== undefined) {
        this.cShooting.shoot();
    }

    this.componentsManager.update();
}

LBPlayer.prototype.updatePosition = function (x, y, callId) {

    // --> DA RIFARE TUTTO QUANTO!!! <--

    //var increment = { x: 0, y: 0 };

    //this.calls.calls.removeItem(callId);
    //this.calls.calls.each(function (key, item) {
    //    increment += switchFunction(item.input);
    //});

    //if (x + increment.x != this.currentTile.x)
    //    this.x = x + increment.x * this.gameInstance.movementGridSize;
    //if (y + increment.y != this.currentTile.y)
    //    this.y = y + increment.y * this.gameInstance.movementGridSize;
}
LBPlayer = function (gameInstance, Tx, Ty, graph) {
    LBSprite.call(this, gameInstance, Tx, Ty, graph);

    //Props
    this.calls = { counter: 0, calls: new LBHashTable() }; //--> DA RIVEDERE TUTTA LA RECONCILIATION <--
    this.cursors = gameInstance.phaserGame.input.keyboard.createCursorKeys(); // --> CERCARE DI INSERIRE NEL COMPONENTE <--
    //Controllo dello ZDepth
    this.zDepth = 0.6;
    //Componenti
    this.cKeyboardInput = new LBKeyboardInputComponent(this);
    this.cSnapping = new LBSnappingComponent(this);
    this.cCollidingMovement = new LBCollidingMovementComponent(this);
    if (gameInstance.overlap) this.cOverlap = new LBOverlapComponent(this);
    this.cMovement = new LBMovementComponent(this);
    this.cShooting = new LBShootingComponent(this);
    this.weapon;
}

LBPlayer.prototype = Object.create(LBSprite.prototype);
LBPlayer.prototype.constructor = LBPlayer;

LBPlayer.prototype.update = function () {
    if (gameInstance.phaserGame.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.weapon === undefined) {
        //this.weapon = new LBWeapon('gun', 5, 12, 1500, 50, 'tree');
        //console.log(this.weapon);
        var test = new LBBullet(gameInstance, this.currentTile.x, this.currentTile.y, 'tree', this.facing, 5, 3, 10);
    }

    if (gameInstance.phaserGame.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.weapon !== undefined) {
        //this.cShooting.shoot();
    }

    if (!this.cMovement.isMoving) {
        if (this.cKeyboardInput.detectInput(this.cursors) != 'null' && (this.cKeyboardInput.increment.x != 0 || this.cKeyboardInput.increment.y != 0)) {
            this.cMovement.move(
                this.cKeyboardInput.targetPoint,
                function (context, increment) {
                    if (context.calls.counter >= 2500) context.calls.counter = 0;
                    context.calls.counter++;
                    context.calls.calls.setItem(context.calls.counter, { id: context.calls.counter, input: context.cKeyboardInput.inputString });
                    eurecaServer.ClientManagement.Player.SendInput(increment, myId, context.calls.counter);
                },
                function (context) {
                    context.currentTile.x += context.cKeyboardInput.increment.x;
                    context.currentTile.y += context.cKeyboardInput.increment.y;
                },
                this.cKeyboardInput.increment,
                175,
                Phaser.Easing.Linear.None
           );
        };
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
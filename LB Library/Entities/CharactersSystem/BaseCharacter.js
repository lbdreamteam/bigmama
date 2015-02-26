BaseCharacter = function (gameInstance, x, y, graph) {
    BaseEntity.call(this, gameInstance, x, y, graph);

    //Proprietà
    this.isMoving = false;
    this.currentTile = { x: (x + (this.gameInstance.movementGridSize / 2)) / this.gameInstance.movementGridSize, y: (y + (this.gameInstance.movementGridSize / 2)) / this.gameInstance.movementGridSize };

    this.zDepth = 0.5;
}

BaseCharacter.prototype = Object.create(BaseEntity.prototype);
BaseCharacter.prototype.constructor = BaseCharacter;


BaseCharacter.prototype.createTween = function (character, target, onStartFunction, onCompleteFunction, input, duration, ease, autoStart, delay, repeat, yoyo) {

    //Definizione parametri opzionali
    if (typeof onStartFunction === 'undefined' || !onStartFunction) { onStartFunction = function () { } }
    if (typeof onCompleteFunction === 'undefined' || !onCompleteFunction) { onCompleteFunction = function () { } }
    if (typeof input === 'undefined' || !input) { input = 'null' }
    if (typeof duration === 'undefined') { duration = 1000; }
    if (typeof ease === 'undefined') { ease = Phaser.Easing.Default; }
    if (typeof autoStart === 'undefined') { autoStart = false; }
    if (typeof delay === 'undefined') { delay = 0; }
    if (typeof repeat === 'undefined') { repeat = 0; }
    if (typeof yoyo === 'undefined') { yoyo = false; }

    var tween = character.gameInstance.phaserGame.add.tween(character);

    tween.to(
        target,
        duration,
        ease,
        autoStart,
        delay,
        repeat, 
        yoyo
    );

    tween.onStart.add(function () {
        //console.log('tween partito: ' + character.id);
        character.isMoving = true;
        onStartFunction(character, input);
        depthSort(gameInstance, character, target);
    });

    tween.onComplete.add(function () {
        onCompleteFunction(character);
        character.isMoving = false;
    });

    tween.start();
}
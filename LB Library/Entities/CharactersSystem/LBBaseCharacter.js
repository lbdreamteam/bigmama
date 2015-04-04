LBBaseCharacter = function (gameInstance, x, y, graph, displayedName, nameVisible) {
    LBBaseEntity.call(this, gameInstance, x, y, graph);

    //Proprietà
    this.zDepth = 0.5;
    this.gameInstance.cDepth.depthGroup.add(this);
    this.graph = graph;
    this.id = displayedName;

    if (typeof displayedName === 'undefined') { }
    else {
        if (typeof nameVisible === 'undefined' || false) {this.nameVisible = false}
        else {
            this.displayedName = this.gameInstance.phaserGame.add.text(15, 60, displayedName, { font: '18px Arial', fill: '#333333' });
            positionDisplayedName(this);
            this.nameVisible = true;
        }
    }

    this.cMovement = new LBMovementComponent(this);
    this.cSnapping = new LBSnappingComponent(this);
    this.cCollidingMovement = new LBCollidingMovementComponent(this);
}

LBBaseCharacter.prototype = Object.create(LBBaseEntity.prototype);
LBBaseCharacter.prototype.constructor = LBBaseCharacter;

LBBaseCharacter.prototype.updateDisplayedName = function () {
    if (this.nameVisible) {
        positionDisplayedName(this);
    }
}

function positionDisplayedName (player) {
    player.displayedName.x = player.x - (player.displayedName.width - player.width) / 2;
    player.displayedName.y = player.y - 32;
}
LBOverlapComponent = function (agent) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.Overlap);

    this.collidableObject = [];

    this.sendDelegate('startMoving', this.findCollidableObject.bind(this));
    this.sendDelegate('endMoving', this.lastCheck.bind(this));
    this.sendUpdate(this.update.bind(this), ['isMoving'], []);
}

LBOverlapComponent.prototype = Object.create(LBBaseComponent.prototype);
LBOverlapComponent.prototype.constructor = LBOverlapComponent;

//Da chiamare una volta all'inizio del movimento, riempe collidableObject
//Ottimizzazione: sostituire maxSpriteWidth con una indicazione della massima distanza tra il tile di appartenenza e il punto più laterale dell'oggetto (sia a destra che a sinistra)
LBOverlapComponent.prototype.findCollidableObject = function (){
	var direction = this.componentsManager.Parameters['direction'];
    this.collidableObject = [];

    var xTile = this.agent.currentTile.x + (direction.x > 0 ? 0 : direction.x),
        yTile = this.agent.currentTile.y + (direction.y > 0 ? 0 : direction.y),

        iStart = yTile - gameInstance.maxTileDown < 0 ? -yTile : -gameInstance.maxTileDown,
        iEnd,
        jStart = xTile - gameInstance.maxTileSide < 0 ? -xTile : -gameInstance.maxTileSide,
        jEnd;

    if (direction.x === 0){           //Movimento verticale
        iEnd = (yTile + gameInstance.maxTileDown + 1 > gameInstance.yLength ? gameInstance.yLength - yTile : gameInstance.maxTileDown + 1);
        jEnd = (xTile + gameInstance.maxTileSide > gameInstance.xLength ? gameInstance.xLength - xTile : gameInstance.maxTileSide);
    }
    else if (direction.y === 0){       //Movimento orizzontale
        iEnd = (yTile + gameInstance.maxTileDown > gameInstance.yLength ? gameInstance.yLength - yTile : gameInstance.maxTileDown);
        jEnd = (xTile + gameInstance.maxTileSide + 1 > gameInstance.xLength ? gameInstance.xLength - xTile : gameInstance.maxTileSide + 1);
    }
    else {              //Movimento diagonale
        //Controllo le righe in mezzo, tra la più alta e la più bassa (alta + maxTileDown +1) incluse (da -maxSide a +maxSide+1)
        iEnd = (yTile + gameInstance.maxTileDown + 1 > gameInstance.yLength ? gameInstance.yLength - yTile : gameInstance.maxTileDown + 1);
        jEnd = (xTile + gameInstance.maxTileSide + 1 > gameInstance.xLength ? gameInstance.xLength - xTile : gameInstance.maxTileSide + 1);
    }

    for (var i = iStart ; i < iEnd ; i++)
        for (var j = jStart ; j < jEnd ; j++)
        	this.checkTileToCollidableObject(gameInstance.objectmap[xTile + j][yTile + i], direction);
}

//Per tutte le sprite in una tile, verifica se è possibile che durante il movimento l'agent vada a colliderci
LBOverlapComponent.prototype.checkTileToCollidableObject = function (actualTile, direction){
	if (actualTile[0] !== undefined)          //Controlla se questo tile contiene qualcosa
        for (var i = 0; i < actualTile.length; i++){
            var sprite = actualTile[i],
                movedAgent = {
                x: this.agent.x + direction.x * gameInstance.movementGridSize,
                y: this.agent.y + direction.y * gameInstance.movementGridSize,
                width: this.agent.width,
                height: this.agent.height,
                anchor: this.agent.anchor,
                key: this.agent.key
            },
                finalResult = this.areInOverlap(movedAgent, sprite);
            if (finalResult !== this.areInOverlap(this.agent, sprite))
                this.collidableObject.push([sprite, 0, finalResult]);
        }
}

//Funzione che rileva se due sprite sono sovrapposte
LBOverlapComponent.prototype.areInOverlap = function (sprite1, sprite2){
    var depthCheck = (gameInstance.cDepth.totalDepth(sprite1) < gameInstance.cDepth.totalDepth(sprite2)),
        ppcResult = false;
    if (depthCheck)
        ppcResult = gameInstance.cPpc.CheckPixelPerfectCollision(sprite1,sprite2);
    return depthCheck && ppcResult;
}

//Controlla l'overlap (isLast serve per indicare se è l'ultima chiamata per questo movimento)
LBOverlapComponent.prototype.checkOverlap = function (isLast){
	for (var i = 0; i < this.collidableObject.length; i++){
		var sprite = this.collidableObject[i][0];
        if (isLast)
            if (this.collidableObject[i][2])
                sprite.alpha = 0.5;
            else
                sprite.alpha = 1;
		else if (++this.collidableObject[i][1] > 7)
            if (this.areInOverlap(this.agent, sprite))
                sprite.alpha = 0.5;
   		    else
                sprite.alpha = 1;
    }
}

LBOverlapComponent.prototype.lastCheck = function(){
    this.checkOverlap(true);
}

//funzione di update dell'overlapComponent
LBOverlapComponent.prototype.update = function(){
    if (this.componentsManager.Parameters['isMoving']){
        //console.log("update dell'overlapComponent");
        this.checkOverlap(false);
    }
}
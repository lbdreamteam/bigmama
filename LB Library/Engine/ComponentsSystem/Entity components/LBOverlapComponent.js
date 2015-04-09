LBOverlapComponent = function (agent) {
    LBBaseComponent.call(this, agent);

    this.collidableObject = [];
    //devo fargli arrivare la direzione
    //this.sendDelegate(this, 'startMoving', this.findCollidableObject.bind(this));
}

LBOverlapComponent.prototype = Object.create(LBBaseComponent.prototype);
LBOverlapComponent.prototype.constructor = LBOverlapComponent;

//Da chiamare una volta all'inizio del movimento, riempe collidableObject
//Ottimizzazione: sostituire maxSpriteWidth con una indicazione della massima distanza tra il tile di appartenenza e il punto più laterale dell'oggetto (sia a destra che a sinistra)
LBOverlapComponent.prototype.findCollidableObject = function (direction){
	this.collidableObject = [];
	var altoSinistra = {
        x: this.agent.x + (1 - this.agent.anchor.x) * this.agent.width + (direction.x < 0 ? 0 : - direction.x * gameInstance.movementGridSize),
        y: this.agent.y + (1 - this.agent.anchor.y) * this.agent.height + (direction.y < 0 ? 0 : - direction.y * gameInstance.movementGridSize),
    },
        xTile = Math.floor(altoSinistra.x / gameInstance.movementGridSize),                             //Coordinata x (in tile) in cui centrare l'esame
        yTile = Math.floor(altoSinistra.y / gameInstance.movementGridSize),   //Coordinata y (in tile) in cui centrare l'esame

        iStart = yTile < 0 ? -yTile : 0,
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
LBOverlapComponent.prototype.checkTileToCollidableObject = function (actualTile, direction)
{
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

//Durante l'update, controlla l'overlap
LBOverlapComponent.prototype.checkOverlap = function (isLast)
{
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

//Funzione che rileva se una sprite e un character sono sovrapposti
LBOverlapComponent.prototype.areInOverlap = function (character, sprite)
{
    var depthCheck = (gameInstance.cDepth.totalDepth(character) < gameInstance.cDepth.totalDepth(sprite)),
        ppcResult = false;
    if (depthCheck)
        ppcResult = gameInstance.cPpc.CheckPixelPerfectCollision(character,sprite);
    return depthCheck && ppcResult;
}
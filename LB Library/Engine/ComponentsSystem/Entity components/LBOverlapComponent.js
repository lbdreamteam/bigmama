LBOverlapComponent = function (agent) {
    LBBaseComponent.call(this, agent);

    this.collidableObject = [];
    this.gameInstance = this.agent.gameInstance;
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
        x: this.agent.x + (1 - this.agent.anchor.x) * this.agent.width + (direction.x < 0 ? 0 : - direction.x * this.gameInstance.movementGridSize),
        y: this.agent.y + (1 - this.agent.anchor.y) * this.agent.height + (direction.y < 0 ? 0 : - direction.y * this.gameInstance.movementGridSize),
    },
        xTile = Math.floor(altoSinistra.x / this.gameInstance.movementGridSize),                             //Coordinata x (in tile) in cui centrare l'esame
        yTile = Math.floor(altoSinistra.y / this.gameInstance.movementGridSize),   //Coordinata y (in tile) in cui centrare l'esame

        iStart = yTile < 0 ? -yTile : 0,
        iEnd,
        jStart = xTile - this.gameInstance.maxTileSide < 0 ? -xTile : -this.gameInstance.maxTileSide,
        jEnd;

    if (direction.x === 0){           //Movimento verticale
        iEnd = (yTile + this.gameInstance.maxTileDown + 1 > this.gameInstance.yLength ? this.gameInstance.yLength - yTile : this.gameInstance.maxTileDown + 1);
        jEnd = (xTile + this.gameInstance.maxTileSide > this.gameInstance.xLength ? this.gameInstance.xLength - xTile : this.gameInstance.maxTileSide);
    }
    else if (direction.y === 0){       //Movimento orizzontale
        iEnd = (yTile + this.gameInstance.maxTileDown > this.gameInstance.yLength ? this.gameInstance.yLength - yTile : this.gameInstance.maxTileDown);
        jEnd = (xTile + this.gameInstance.maxTileSide + 1 > this.gameInstance.xLength ? this.gameInstance.xLength - xTile : this.gameInstance.maxTileSide + 1);
    }
    else {              //Movimento diagonale
        //Controllo le righe in mezzo, tra la più alta e la più bassa (alta + maxTileDown +1) incluse (da -maxSide a +maxSide+1)
        iEnd = (yTile + this.gameInstance.maxTileDown + 1 > this.gameInstance.yLength ? this.gameInstance.yLength - yTile : this.gameInstance.maxTileDown + 1);
        jEnd = (xTile + this.gameInstance.maxTileSide + 1 > this.gameInstance.xLength ? this.gameInstance.xLength - xTile : this.gameInstance.maxTileSide + 1);
    }

    for (var i = iStart ; i < iEnd ; i++)
        for (var j = jStart ; j < jEnd ; j++)
        	this.checkTileToCollidableObject(this.gameInstance.objectmap[xTile + j][yTile + i], direction);
}

//Per tutte le sprite in una tile, verifica se è possibile che durante il movimento l'agent vada a colliderci
LBOverlapComponent.prototype.checkTileToCollidableObject = function (actualTile, direction)
{
	if (actualTile[0] !== undefined)          //Controlla se questo tile contiene qualcosa
        for (var i = 0; i < actualTile.length; i++){
            var sprite = actualTile[i],
                movedAgent = {
                x: this.agent.x + direction.x * this.gameInstance.movementGridSize,
                y: this.agent.y + direction.y * this.gameInstance.movementGridSize,
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
    var depthCheck = (this.gameInstance.cDepth.totalDepth(character) < this.gameInstance.cDepth.totalDepth(sprite)),
        ppcResult = false;
    if (depthCheck)
        ppcResult = this.gameInstance.cPpc.CheckPixelPerfectCollision(character,sprite);
    return depthCheck && ppcResult;
}
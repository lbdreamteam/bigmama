var maxZ = 100;

//Funzione per ordinare gli oggetti nell'ordine di rendering
//utilizza character e target per capire se il player si sta muovendo e in quale direzione
//character è l'entity che si sta muovendo, target è il punto verso cui si sta muovendo
function depthSort(game, character, target){
	if (target === undefined || character === undefined) game.depthGroup.customSort(depthSortHandler);
    else if (target.y > character.y) game.depthGroup.customSort(downDepthSortHandler);
    else if (target.y < character.y) game.depthGroup.customSort(upDepthSortHandler);
    else game.depthGroup.customSort(depthSortHandler);
}

//Utilizzato da group.customSort per ordinare una coppia di oggetti
function depthSortHandler(a, b){
	if (totalDepth(a) > totalDepth(b)) return 1;
	else if (totalDepth(a) === totalDepth(b)) return 0;
	else return -1;
}

//Come depthSortHandler solo che considera un oggetto in movimento verso il basso come al punto di arrivo
function downDepthSortHandler(a, b){
	return depthSortHandler(moveDepth(a,1),moveDepth(b,1));
}

//Come depthSortHandler solo che considera un oggetto in movimento verso l'alto come al punto di arrivo
function upDepthSortHandler(a, b){
	return depthSortHandler(moveDepth(a,-1),moveDepth(b,-1));
}

//Se un oggetto si sta muovendo lo sposta nella direzione indicata, altrimenti lo lascia invariato
//direction: 1 down, -1 up
function moveDepth(a, direction){
	return result = {
		y: a.cMovement != undefined? a.cMovement.isMoving ? a.y + 32 * direction : a.y : a.y,
		zDepth: a.zDepth,
		height: a.height
	}
}

//Calcola la profondità(con cui va ordinato) di un generico oggetto con una coordinata y ed eventualmente una zDepth
function totalDepth(a){
	if (a.zDepth === undefined) return (a.y + a.height) * maxZ;
	else return (a.y + a.height) * maxZ + a.zDepth;
}

//Ottimizzazione: sostituire maxSpriteWidth con una indicazione della massima distanza tra il tile di appartenenza e il punto più laterale dell'oggetto (sia a destra che a sinistra)

//TODO(prima o poi): mettere quei cicli in funzioni (non migliora la velocità del programma, solo per chiarezza e pulizia del codice)

//Sistema più efficiente (in termini di pixel-perfect collision)
//Scorre l'intera area in cui possono trovarsi oggetti in overlap con il palyer (l'area cambia a seconda della direzione del movimento)
//Se trova un oggetto in quest'area, chiama checkTileOverlap
function overlapHandler(character, gameInstance, direction){
    if (gameInstance.overlap){
        var maxTileDown = Math.floor((gameInstance.maxSpriteHeight - 1) / gameInstance.movementGridSize) + 2;  //Massima distanza (in tile) da controllare verso il basso
        var maxTileSide = Math.floor((gameInstance.maxSpriteWidth - 1) / gameInstance.movementGridSize) + 1;   //Massima distanza (in tile) da controllare lateralmente
        var xLength = gameInstance.objectmap.length;                            //Dimensione x (in tile) della mappa
        var yLength = gameInstance.objectmap[0].length;                         //Dimensione y (in tile) della mappa
        var xTile                           //Coordinata x (in tile) in cui centrare l'esame
        var yTile                           //Coordinata y (in tile) in cui centrare l'esame

        maxTileDown++; //Da togliere con la pixel-perfect collision
        maxTileSide++; //Da togliere con la pixel-perfect collision

        //Contine le due coordinate più alte (y minore) e a sinistra (x minore) tra la posizione iniziale e finale del palyer
        var altoSinistra = {
            x: character.x + (direction.x <= 0 ? 0 : - direction.x * gameInstance.movementGridSize),
            y: character.y + (direction.y <= 0 ? 0 : - direction.y * gameInstance.movementGridSize),
            //height: character.height
        }
        if (direction.x === 0){           //Movimento verticale
            xTile = character.x / gameInstance.movementGridSize;
            //Sposto la partenza alla posizione più alta
            yTile = Math.floor((altoSinistra.y + character.height - 1) / gameInstance.movementGridSize);
            for (var i = (yTile < 0 ? -yTile : 0) ; i < (yTile + maxTileDown + 1 > yLength ? yLength - yTile : maxTileDown + 1) ; i++)
                for (var j = (xTile - maxTileSide < 0 ? -xTile : -maxTileSide) ; j < (xTile + maxTileSide > xLength ? xLength - xTile : maxTileSide) ; j++)
                    checkTileOverlap(character, gameInstance.objectmap[xTile + j][yTile + i]);
        }
        else if (direction.y === 0){       //Movimento orizzontale
            yTile = Math.floor((character.y + character.height - 1) / gameInstance.movementGridSize);
            //Prendo la posizione più a sinistra, poi allungo il controllo a destra di un tile
            xTile = altoSinistra.x / gameInstance.movementGridSize;
            for (var i = (yTile < 0 ? -yTile : 0) ; i < (yTile + maxTileDown > yLength ? yLength - yTile : maxTileDown) ; i++)
                for (var j = (xTile - maxTileSide < 0 ? -xTile : -maxTileSide) ; j < (xTile + maxTileSide + 1 > xLength ? xLength - xTile : maxTileSide + 1) ; j++)
                    checkTileOverlap(character, gameInstance.objectmap[xTile + j][yTile + i]);
        }
        else if (direction.x * direction.y > 0){     //Movimento diagonale \ ({+1,+1},{-1,-1})
            xTile = altoSinistra.x / gameInstance.movementGridSize;
            yTile = Math.floor((altoSinistra.y + character.height - 1) / gameInstance.movementGridSize);
            //Controllo la riga all'altezza massima (da -maxSide a +maxSide)
            if (yTile >= 0 && yTile < yLength)
                for (var j = (xTile - maxTileSide < 0 ? -xTile : -maxTileSide) ; j < (xTile + maxTileSide > xLength ? xLength - xTile : maxTileSide) ; j++)
                    checkTileOverlap(character, gameInstance.objectmap[xTile + j][yTile]);
            //Controllo la riga più in basso, all'altezza bassa (alta + 1) più maxTileDown (da -maxSide+1 a +maxSide+1)
            if (yTile + 1 + maxTileDown < yLength && yTile + 1 + maxTileDown >= 0)
                for (var j = (xTile - maxTileSide + 1 < 0 ? -xTile : -maxTileSide + 1) ; j < (xTile + maxTileSide + 1 > xLength ? xLength - xTile : maxTileSide + 1) ; j++)
                    checkTileOverlap(character, gameInstance.objectmap[xTile + j][yTile + 1 + maxTileDown]);
            //Controllo le righe in mezzo, tra la più alta e la più bassa escluse (da -maxSide a +maxSide+1)
            for (var i = (yTile + 1 < 0 ? -yTile : 1) ; i < (yTile + maxTileDown > yLength ? yLength - yTile : maxTileDown) ; i++)
                for (var j = (xTile - maxTileSide < 0 ? -xTile : -maxTileSide) ; j < (xTile + maxTileSide + 1 > xLength ? xLength - xTile : maxTileSide + 1) ; j++)
                    checkTileOverlap(character, gameInstance.objectmap[xTile + j][yTile + i]);
        }
        else {                                       //Movimento diagonale / ({+1,-1,{-1,+1}})
            xTile = altoSinistra.x / gameInstance.movementGridSize;
            yTile = Math.floor((altoSinistra.y + character.height - 1) / gameInstance.movementGridSize);
            //Controllo la riga all'altezza massima (da -maxSide+1 a +maxSide+1)
            if (yTile >= 0 && yTile < yLength)
                for (var j = (xTile - maxTileSide + 1 < 0 ? -xTile : -maxTileSide + 1) ; j < (xTile + maxTileSide + 1 > xLength ? xLength - xTile : maxTileSide + 1) ; j++)
                    checkTileOverlap(character, gameInstance.objectmap[xTile + j][yTile]);
            //Controllo la riga più in basso, all'altezza bassa (alta + 1) più maxTileDown (da -maxSide a +maxSide)
            if (yTile + 1 + maxTileDown < yLength && yTile + 1 + maxTileDown >= 0)
                for (var j = (xTile - maxTileSide < 0 ? -xTile : -maxTileSide) ; j < (xTile + maxTileSide > xLength ? xLength - xTile : maxTileSide) ; j++)
                    checkTileOverlap(character, gameInstance.objectmap[xTile + j][yTile + 1 + maxTileDown]);
            //Controllo le righe in mezzo, tra la più alta e la più bassa escluse (da -maxSide a +maxSide+1)
            for (var i = (yTile + 1 < 0 ? -yTile : 1) ; i < (yTile + maxTileDown > yLength ? yLength - yTile : maxTileDown) ; i++)
                for (var j = (xTile - maxTileSide < 0 ? -xTile : -maxTileSide) ; j < (xTile + maxTileSide + 1 > xLength ? xLength - xTile : maxTileSide + 1) ; j++)
                    checkTileOverlap(character, gameInstance.objectmap[xTile + j][yTile + i]);
        }
    }
}

//Verifica se tutte le sprite in un certo tile devono essere messe in trasparenza o meno rispetto al player
function checkTileOverlap(character, actualTile)
{
    if (actualTile[0] !== undefined)          //Controlla per tutti i tile nel rettangolo se contengono qualcosa
        for (var i = 0; i < actualTile.length; i++){
            var sprite = actualTile[i];
            if ((totalDepth(character) < totalDepth(sprite)) && (character.overlap(sprite)))
                sprite.alpha = 0.5;
            else
                sprite.alpha = 1;
        }
}
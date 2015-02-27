//var map;
var maxZ = 100;

//Funzione per ordinare gli oggetti nell'oredine di rendering
//utilizza character e target per capire se il player si sta muovendo e in quale direzione
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
		y: a.isMoving ? a.y + 32 * direction : a.y,
		zDepth: a.zDepth,
		height: a.height
	}
}

//Calcola la profondità(con cui va ordinato) di un generico oggetto con una coordinata y ed eventualmente una zDepth
function totalDepth(a){
	if (a.zDepth === undefined) return (a.y + a.height) * maxZ;
	else return (a.y + a.height) * maxZ + a.zDepth;
}

//Controlla la sovrapposizione del player ad un oggetto intorno a lui. In caso di sovrapposizione manda l'oggetto in trasparenza
function checkOverlap(player, gameInstance, target) {
    examineSpriteArea(player, gameInstance, function (sprite) {
        if ((player.overlap(sprite)) && (totalDepth(player) < totalDepth(sprite)))
            sprite.alpha = 0.5;
    });
}

//Elimina la trasparenza dalgi oggetti che non sono più sovrapposti al player 
function leaveOverlap(player, gameInstance, movement) {
    examineSpriteArea(spriteToPass = {
        x: player.x - movement.x * gameInstance.movementGridSize,
        y: player.y - movement.y * gameInstance.movementGridSize,
        height: player.height
    }, gameInstance, function (sprite) {
        if (!player.overlap(sprite) || totalDepth(player) >= totalDepth(sprite))
            sprite.alpha = 1;
    })
}

//Ottimizzazione: sostituire maxSpriteWidth con una indicazione della massima distanza tra il tile di appartenenza e il punto più laterale dell'oggetto (sia a destra che a sinistra)

//Esamina il rettangolo che può contenere sprite in sovrapposizione con una sprite di coordinate (x,y)
function examineSpriteArea(sprite, gameInstance, work) {
    var xTile = sprite.x / gameInstance.movementGridSize;									//Coordinata x (in tile) in cui centrare l'esame
    var yTile = Math.floor((sprite.y + sprite.height - 1) / gameInstance.movementGridSize);	//Coordinata y (in tile) in cui centrare l'esame
    var maxTileDownCheck = Math.floor((gameInstance.maxSpriteHeight - 1) / gameInstance.movementGridSize) + 2;	//Massima distanza (in tile) da controllare verso il basso
    var maxTileSideCheck = Math.floor((gameInstance.maxSpriteWidth - 1) / gameInstance.movementGridSize) + 1;		//Massima distanza (in tile) da controllare lateralmente
    var xLength = gameInstance.objectmap.length;							//Dimensione x (in tile) della mappa
    var yLength = gameInstance.objectmap[0].length;							//Dimensione y (in tile) della mappa

    //Scorre tutte le posizioni della mappa dentro al rettangolo di controllo
    for (var i = (yTile < 0 ? -yTile : 0) ; i < (yTile + maxTileDownCheck > yLength ? yLength - yTile : maxTileDownCheck) ; i++)
        for (var j = (xTile - maxTileSideCheck < 0 ? -xTile : -maxTileSideCheck) ; j < (xTile + maxTileSideCheck > xLength ? xLength - xTile : maxTileSideCheck) ; j++)
            if (gameInstance.objectmap[xTile + j][yTile + i][0] !== undefined)			//Controlla per tutti i tile nel rettangolo se contengono qualcosa
            {
                //Se contengono qualcosa, esegue work su ogni oggetto contenuto in quel tile
                var actualTile = gameInstance.objectmap[xTile + j][yTile + i];
                for (var t = 0; t < actualTile.length; t++)
                    work(actualTile[t]);
            }
}
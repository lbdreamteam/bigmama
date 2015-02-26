//var map;
var maxZ = 100;

function depthSort(game, character, target){
	if (target === undefined || character === undefined) game.depthGroup.customSort(depthSortHandler);
    else if (target.y > character.y) game.depthGroup.customSort(downDepthSortHandler);
    else if (target.y < character.y) game.depthGroup.customSort(upDepthSortHandler);
    else game.depthGroup.customSort(depthSortHandler);
}

//Calcola se un oggetto è maggiore di un altro nell'ordine della profondità
function depthSortHandler(a,b){
	if (totalDepth(a) > totalDepth(b)) return 1;
	else if (totalDepth(a) === totalDepth(b)) return 0;
	else return -1;
}

function downDepthSortHandler(a,b){	
	return depthSortHandler(moveDepth(a,1),moveDepth(b,1));
}

function upDepthSortHandler(a,b){
	return depthSortHandler(moveDepth(a,-1),moveDepth(b,-1));
}

//direction: 1 down, -1 up
function moveDepth(a,direction){
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

//Ottimizzazione: controllare solo gli oggetti che entrano nel rettangolo di apparizione
function checkOverlap(player){
	var maxTileDownCheck = Math.floor(player.gameInstance.maxSpriteHeight/player.gameInstance.movementGridSize);
	var maxTileSideCheck = Math.floor(player.gameInstance.maxSpriteWidth/player.gameInstance.movementGridSize);
	var xTile = player.x/player.gameInstance.movementGridSize;
	var yTile = (player.y+player.height)/player.gameInstance.movementGridSize;
	var xLength = player.gameInstance.objectmap.length;
	var yLength = player.gameInstance.objectmap[0].length;
	for (var i = 0; i < (yTile+maxTileDownCheck > yLength?yLength-yTile:maxTileDownCheck); i++)
		for (var j = (xTile-maxTileSideCheck < 0? -xTile: -maxTileSideCheck); j < (xTile+maxTileSideCheck > xLength? xLength-xTile:maxTileSideCheck); j++)
			if (player.gameInstance.objectmap[xTile+j][yTile+i][0] !== undefined)
			{
				var actualTile = player.gameInstance.objectmap[xTile+j][yTile+i];
				for (var t=0; t < actualTile.length; t++)
					if ((player.overlap(actualTile[t]))&&(totalDepth(player) < totalDepth (actualTile[t])))
						actualTile[t].alpha = 0.5;
			}
}

//Ottimizzazione: controllare solo gli oggetti che sono nel rettangolo di direzione opposta al movimento
function leaveOverlap(player){
	var maxTileDownCheck = Math.floor(player.gameInstance.maxSpriteHeight/player.gameInstance.movementGridSize)+2+Math.floor(player.height/player.gameInstance.movementGridSize);
	var maxTileSideCheck = Math.floor(player.gameInstance.maxSpriteWidth/player.gameInstance.movementGridSize)+1;
	var xTile = player.x/player.gameInstance.movementGridSize;
	var yTile = player.y/player.gameInstance.movementGridSize-1;
	var xLength = player.gameInstance.objectmap.length;
	var yLength = player.gameInstance.objectmap[0].length;
	for (var i = (yTile===-1?1:0); i < (yTile+maxTileDownCheck > yLength? yLength-yTile:maxTileDownCheck); i++)
		for (var j = (xTile-maxTileSideCheck < 0? -xTile: -maxTileSideCheck); j < (xTile+maxTileSideCheck > xLength? xLength-xTile:maxTileSideCheck); j++)
			if (player.gameInstance.objectmap[xTile+j][yTile+i][0] !== undefined)
			{
				var actualTile = player.gameInstance.objectmap[xTile+j][yTile+i];
				for (var t=0; t < actualTile.length; t++)
				{
					if (!player.overlap(actualTile[t]) || totalDepth(player) >= totalDepth(actualTile[t]))
						actualTile[t].alpha = 1;
				}
			}
}
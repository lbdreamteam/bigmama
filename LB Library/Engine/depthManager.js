//var map;
var objectmap;
var maxZ = 100,				//da sistemare
	maxSpriteHeight = 0,
	maxSpriteWidth = 0;

function depthSort(game, character, target){
    if (target.y > character.y) game.depthGroup.customSort(downDepthSortHandler);
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

//Carica una imagine e controlla che maxSpriteHeight e maxSpriteWidth siano ancora max
function loadImage(LBgame, cacheName, path){
	LBgame.phaserGame.load.image(cacheName, path);
	LBgame.phaserGame.load.onLoadComplete.add(function (){
		var image = LBgame.phaserGame.cache.getImage(cacheName);
		if (image.height > maxSpriteHeight) maxSpriteHeight = image.height;
		if (image.width > maxSpriteWidth) maxSpriteWidth = image.width;
	});
}

/* 	if (zDepth===undefined)
   		this.zDepth=0;
   	else
   		this.zDepth=zDepth; */

//Ottimizzazione: controllare solo gli oggetti che sono nel rettangolo di direzione opposta al movimento
function leaveOverlap(player){
	var maxTileDownCheck = Math.floor(maxSpriteHeight/player.gameInstance.movementGridSize)+2;
	var maxTileSideCheck = Math.floor(maxSpriteWidth/player.gameInstance.movementGridSize)+1;
	var xTile = player.x/player.gameInstance.movementGridSize;
	var yTile = player.y/player.gameInstance.movementGridSize-1;
	for (var i = (yTile===-1?1:0); i < (yTile+maxTileDownCheck > objectmap[0].length? objectmap[0].length-yTile:maxTileDownCheck); i++)
		for (var j = (xTile-maxTileSideCheck < 0? -xTile: -maxTileSideCheck); j < (xTile+maxTileSideCheck > objectmap.length? objectmap.length-xTile:maxTileSideCheck); j++)
			if (objectmap[xTile+j][yTile+i][0] !== undefined)
			{
				var actualTile = objectmap[xTile+j][yTile+i];
				for (var t=0; t < actualTile.length; t++)
				{
					if (!player.overlap(actualTile[t]))
						actualTile[t].alpha = 1;
				}
			}
}


//Ottimizzazione: controllare solo gli oggetti che entrano nel rettangolo di apparizione
function checkOverlap(player){
	var maxTileDownCheck = Math.floor(maxSpriteHeight/player.gameInstance.movementGridSize);
	var maxTileSideCheck = Math.floor(maxSpriteWidth/player.gameInstance.movementGridSize);
	var xTile = player.x/player.gameInstance.movementGridSize;
	var yTile = player.y/player.gameInstance.movementGridSize;
	for (var i = 0; i < (yTile+maxTileDownCheck > objectmap[0].length? objectmap[0].length-yTile:maxTileDownCheck); i++)
		for (var j = (xTile-maxTileSideCheck < 0? -xTile: -maxTileSideCheck); j < (xTile+maxTileSideCheck > objectmap.length? objectmap.length-xTile:maxTileSideCheck); j++)
			if (objectmap[xTile+j][yTile+i][0] !== undefined)
			{
				var actualTile = objectmap[xTile+j][yTile+i];
				for (var t=0; t < actualTile.length; t++)
					if ((player.overlap(actualTile[t]))&&(totalDepth(player) < totalDepth (actualTile[t])))
						actualTile[t].alpha = 0.5;
			}
}

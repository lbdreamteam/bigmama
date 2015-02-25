//var map;
//var objectmap;
var maxZ = 100,
	maxSpriteHeight = 0,
	maxSpriteWidth = 0;

function depthSort(game, input){
    if (input === 'down' || input === 'down-right' || input === 'down-left')
    	game.depthGroup.customSort(downDepthSortHandler);
    else if (input === 'up' || input === 'up-right' || input === 'up-left')
    	game.depthGroup.customSort(upDepthSortHandler);
    else
       	game.depthGroup.customSort(depthSortHandler);
}

function depthSortHandler(a,b){
	if (totalDepth(a) > totalDepth(b))
		return 1;
	else if (totalDepth(a) === totalDepth(b))
		return 0;
	else
		return -1;
}

function downDepthSortHandler(a,b){	
	return depthSortHandler(moveDepth(a,1),moveDepth(b,1));
}

function upDepthSortHandler(a,b){
	return depthSortHandler(moveDepth(a,-1),moveDepth(b,-1));
}

//direction: 1 down, -1 up
function moveDepth(a,direction){
	var result = {
		y: a.isMoving? a.y+32*direction : a.y,
		zDepth: a.zDepth,
		height: a.height
	}
	return result;
}

function totalDepth(a){
	if (a.zDepth === undefined)
		return (a.y+a.height)*maxZ;
	else
		return (a.y+a.height)*maxZ+a.zDepth;
}

function loadImage(LBgame, cacheName, path){
	LBgame.phaserGame.load.image(cacheName, path);
	LBgame.phaserGame.load.onLoadComplete.add(function (){
		var image = LBgame.phaserGame.cache.getImage(cacheName);
		if (image.height > maxSpriteHeight)
			maxSpriteHeight = image.height;
		if (image.width > maxSpriteWidth)
			maxSpriteWidth = image.width;
	});
}

/* 	if (zDepth===undefined)
   		this.zDepth=0;
   	else
   		this.zDepth=zDepth; */

/*
//Finire la funzione che rende trasparenti gli oggetti

//Aggiungere la funzione che fa riapparire gli oggetti traspraenti qundo mi muovo

function checkOverlap(x,y){
	var maxTileDownCheck = Math.floor(maxSpriteHeight/gameIstance.movementGridSize)+1;
	var maxTileSideCheck = Math.floor(maxSpriteWidth/(gameIstance.movementGridSize*2))+1;
	var xTile = x/gameIstance.movementGridSize;
	var yTile = y/gameIstance.movementGridSize;
	for (var i = 0; i > -maxTileDownCheck; i--)
		for (var j=-maxTileSideCheck; j < maxTileSideCheck; j++)
			if (objectmap[x+i][y+j][0] !== null)
				for (var t=0; t < objectmap[x+i][y+j].count; t++)

}*/
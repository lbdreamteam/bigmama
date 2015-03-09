



//Carica la matrice dei pixel dell'imagine con nome 
function loadPixelMatrix(gameInstance, cacheName, path){
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
            gameInstance.spriteCollisionMatrix[cacheName] = JSON.parse(xmlhttp.responseText);
            xmlhttp = undefined;
        }
        else if (xmlhttp.readyState === 4 && xmlhttp.status === 404)
        {
            gameInstance.spriteCollisionMatrix[cacheName] = createPlaceholderMatrix(gameInstance, cacheName);
        }
    }
    //Prova ad aprire
    try {
    var jsonPath = path.substr(0,path.lastIndexOf('.')) + 'Matrix.json';
    xmlhttp.open("GET",jsonPath,true);
    xmlhttp.send();
    } catch (e) {
        xmlhttp.abort();
    }
}

//Crea una matrice dei pixel dell'immagine chiamata imageName nella cache temporanea, con un unico rettangolo.
//Manda anche un messaggio nella console avvertendo di questo fatto
function createPlaceholderMatrix(gameInstance, imageName){
	console.log('ATTENTION: missing pixel matrix for the image '+imageName+'. A  temporary pixel matrix has been created, but its use may reduce performance');
	var im = gameInstance.phaserGame.cache.getImage(imageName);
	var bm = new Phaser.BitmapData(gameInstance.phaserGame,imageName+'PlaceholderMatrix',im.width,im.height);
	bm.draw(im);
	bm.update();
	var matrix = [];
	for (var i = 0; i < im.width; i++) {
    	matrix[i] = [];
	    for (var j = 0; j < im.height; j++) {
        	matrix[i][j] = bm.getPixel(i,j).a > 0 ? 1 : 0;
    	};
	};
	gameInstance.phaserGame.cache.removeBitmapData(imageName+'PlaceholderMatrix');
	im = bm = undefined;
	return [{topleft:{x:0,y:0}, bottomright:{x:matrix.length,y:matrix[0].length}, matrix:matrix}];
}

/*function matrixrect(topleft, bottomright, matrix){
    this.topleft = topleft;
    this.bottomright = bottomright;
    this.matrix = matrix;
}*/
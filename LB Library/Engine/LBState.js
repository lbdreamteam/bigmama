LBState = function () {
    Phaser.State.call(this);
};

LBState.prototype = Object.create(Phaser.State.prototype);
LBState.prototype.constructor = LBState;

LBState.prototype.loadImages = function (images, callback) {
    console.log('--> LOADING GRAPHICS <--');
    callback = callback || null;
    var queue = images.slice(),
        pending = [];
    for (var iImage in images) {
        var currentImage = images[iImage];
        gameInstance.phaserGame.load.image(currentImage[0], currentImage[1]);
        console.log('++ Enqueued ' + currentImage[0] + ' asset');

        gameInstance.phaserGame.load.onLoadComplete.add(function () {
            var completedImage = queue[0];
            console.log('-- Completed loading ' + completedImage[0] + ' asset');
            queue.splice(0, 1);
            pending.push(completedImage);
            if (queue.length == 0) {
                for (var iP in pending) {
                    var currentPending = pending[iP];
                    if (gameInstance.overlap) {
                        //Modifica le dimensioni di maxSpriteWidth e Heigth
                        var image = gameInstance.phaserGame.cache.getImage(currentPending[0]);
                        if (image.height > gameInstance.maxSpriteHeight) gameInstance.maxSpriteHeight = image.height;
                        if (image.width > gameInstance.maxSpriteWidth) gameInstance.maxSpriteWidth = image.width;
                        gameInstance.maxTileDown = Math.floor(gameInstance.maxSpriteHeight / gameInstance.movementGridSize) + 2;
                        gameInstance.maxTileSide = Math.floor(gameInstance.maxSpriteWidth / gameInstance.movementGridSize) + 1;
                    }
                    //Crea la matrice dei pixel intera (la aggiunge a spritePixelMatrix)

                    if (!gameInstance.spritePixelMatrix[currentPending[0]]) gameInstance.spritePixelMatrix[currentPending[0]] = this.createPixelMatrix(currentPending[0]);
                    //Carica la matrice dei pixel spezzata, se non esiste copia quella intera (la aggiunge a spriteCollisionMatrix)
                    if (!gameInstance.cPpc.spriteCollisionMatrix[currentPending[0]]) this.loadCollisionPixelMatrix(currentPending[0], currentPending[1]);

                    console.log('// Finished loading graphic ' + currentPending[0]);
                }
                console.log('--> FINISHED LOADING GRAPHICS <--');
                gameInstance.phaserGame.load.onLoadComplete.removeAll();
                if (!callback) return true;
                callback();
            }
        }.bind(this));
    }
};

LBState.prototype.createPixelMatrix = function (cacheName) {
    console.log('Carico la matrice di ' + cacheName);
    var im = gameInstance.phaserGame.cache.getImage(cacheName);
    var bm = new Phaser.BitmapData(gameInstance.phaserGame, cacheName + 'PixelMatrix', im.width, im.height);
    bm.draw(im);
    bm.update();
    var matrix = [];
    for (var i = 0; i < im.width; i++) {
        matrix[i] = [];
        for (var j = 0; j < im.height; j++) {
            matrix[i][j] = bm.getPixel(i, j).a > 0 ? 1 : 0;
        };
    };
    gameInstance.phaserGame.cache.removeBitmapData(cacheName + 'PixelMatrix');
    im = bm = undefined;
    return { topleft: { x: 0, y: 0 }, bottomright: { x: matrix.length, y: matrix[0].length }, matrix: matrix };
};

LBState.prototype.loadCollisionPixelMatrix = function (cacheName, path) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            gameInstance.cPpc.spriteCollisionMatrix[cacheName] = JSON.parse(xmlhttp.responseText);
            xmlhttp = undefined;
        }
        else if (xmlhttp.readyState === 4 && xmlhttp.status === 404) {
            console.warn('ATTENTION: missing pixel matrix for the image ' + cacheName + '. A  temporary pixel matrix has been created, but its use may reduce performance');
            gameInstance.cPpc.spriteCollisionMatrix[cacheName] = [gameInstance.spritePixelMatrix[cacheName]];
            xmlhttp = undefined;
        }
    };
    //Prova ad aprire
    try {
        var jsonPath = path.substr(0, path.lastIndexOf('.')) + 'Matrix.json';
        xmlhttp.open("GET", jsonPath, true);
        xmlhttp.send();
    } catch (e) {
        xmlhttp.abort();
    }
};
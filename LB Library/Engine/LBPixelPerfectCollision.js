//Verifica se sprite1 e sprite2 (phaser.Sprite) sono in collisione con una pixel perfect collision
function CheckPixelPerfectCollision (sprite1, sprite2, gameInstance){
    //Controllo se i due oggetti si intersecano (prima sull'asse x perchè è più significativo)
    if (CheckAxisIntersection(sprite1, sprite2, "x") && CheckAxisIntersection(sprite1, sprite2, "y")){
        //Controllo delle intersezioni dei rettangoli
        var matrix1 = gameInstance.spriteCollisionMatrix[sprite1.key];
        var matrix2 = gameInstance.spriteCollisionMatrix[sprite2.key];
        var vect21 = {
            x: sprite2.x - sprite1.x,
            y: sprite2.y - sprite1.y
        };
        for (var i = 0; i < matrix1.length; i++)
            for (var j = 0; j < matrix2.length; j++){
                if (CheckRectangleIntersection(matrix1[i], matrix2[j], vect21)){
                    //Se due rettangoli si intersecano, devo chiamare la ppc vera e propria
                    var vectm2m1 = {
                        x: matrix2[i].topleft.x + vect21.x - matrix1[j].topleft.x,
                        y: matrix2[i].topleft.y + vect21.y - matrix1[j].topleft.y
                    };
                    if (CheckRectanglePerfectCollision(matrix1[i], matrix2[j], vectm2m1))
                        return true;
                }
            }
    }
    return false;
}

//funzione che controlla se due oggetti sono sovrapposti su una coordinata
//ritorna vero se i due oggetti si sovrappongono su quella coordinata
//axis va passata come string. O "x" o "y"
function CheckAxisIntersection (sprite1, sprite2, axis){
    var dim = axis === "x" ? "width" : "height";
    if (sprite1[axis] < sprite2[axis])
        return sprite1[axis]+sprite1[dim] > sprite2[axis];
    else
        return sprite2[axis]+sprite2[dim] > sprite1[axis];
}

//funzione che controlla se due rettangoli (oggetti con topleft e bottomright) si sovrappongono
//vect è il vettore che contiene la posizione di sprite2 rispetto a sprite1
function CheckRectangleIntersection (rect1, rect2, vect){
    var rect1b = {
        x: rect1.topleft.x,
        y: rect1.topleft.y,
        width: rect1.bottomright.x - rect1.topleft.x,
        height: rect1.bottomright.y - rect1.topleft.y
    }
    var rect2b = {
        x: rect2.topleft.x + vect.x,
        y: rect2.topleft.y + vect.y,
        width: rect2.bottomright.x - rect2.topleft.x,
        height: rect2.bottomright.y - rect2.topleft.y
    }
    //controllo prima sulla y perchè più significativa
    return CheckAxisIntersection(rect1b,rect2b,"y") && CheckAxisIntersection(rect1b,rect2b,"x");
}

//funzione che effettua la vera e propria pixel perfect collision tra due matrici di punti
//vect contiene la posizione di rect1 rispetto a rect2
function CheckRectanglePerfectCollision(rect1, rect2, vect){
    //Controllo pixel per pixel con rect2 spostato di vect
    // estremi del controllo riferiti a rect1
    var mat1 = rect1.matrix;
    var mat2 = rect2.matrix;
    var lowTop = vect.y > 0 ? vect.y : 0;
    var highBottom = vect.y + rect2.bottomright.y - rect2.topleft.y < rect1.bottomright.y - rect1.topleft.y ? vect.y + rect2.bottomright.y - rect2.topleft.y : rect1.bottomright.y - rect1.topleft.y;
    var highLeft = vect.x > 0 ? vect.x : 0;
    var lowRight = vect.x + rect2.bottomright.x - rect2.topleft.x < rect1.bottomright.x - rect1.topleft.x ? vect.x + rect2.bottomright.x - rect2.topleft.x : rect1.bottomright.x - rect1.topleft.x;
    //controllo con gli estremi riferiti a rect1 (quindi traslo rect2 di -vect)
    for (var i = highLeft; i < lowRight; i++)
        for (var j = lowTop; j < highBottom; j++)
            if (mat1[i][j] * mat2[i-vect.x][j-vect.y])
                return true;
    return false;
}

//Carica la matrice dei pixel dell'imagine con nome 
function loadPixelMatrix(gameInstance, cacheName, path) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            gameInstance.spriteCollisionMatrix[cacheName] = JSON.parse(xmlhttp.responseText);
            xmlhttp = undefined;
        }
        else if (xmlhttp.readyState === 4 && xmlhttp.status === 404) {
            gameInstance.spriteCollisionMatrix[cacheName] = createPlaceholderMatrix(gameInstance, cacheName);
        }
    }
    //Prova ad aprire
    try {
        var jsonPath = path.substr(0, path.lastIndexOf('.')) + 'Matrix.json';
        xmlhttp.open("GET", jsonPath, true);
        xmlhttp.send();
    } catch (e) {
        xmlhttp.abort();
    }
}

//Crea una matrice dei pixel dell'immagine chiamata imageName nella cache temporanea, con un unico rettangolo.
//Manda anche un messaggio nella console avvertendo di questo fatto
function createPlaceholderMatrix(gameInstance, imageName) {
    console.log('ATTENTION: missing pixel matrix for the image ' + imageName + '. A  temporary pixel matrix has been created, but its use may reduce performance');
    var im = gameInstance.phaserGame.cache.getImage(imageName);
    var bm = new Phaser.BitmapData(gameInstance.phaserGame, imageName + 'PlaceholderMatrix', im.width, im.height);
    bm.draw(im);
    bm.update();
    var matrix = [];
    for (var i = 0; i < im.width; i++) {
        matrix[i] = [];
        for (var j = 0; j < im.height; j++) {
            matrix[i][j] = bm.getPixel(i, j).a > 0 ? 1 : 0;
        };
    };
    gameInstance.phaserGame.cache.removeBitmapData(imageName + 'PlaceholderMatrix');
    im = bm = undefined;
    return [{ topleft: { x: 0, y: 0 }, bottomright: { x: matrix.length, y: matrix[0].length }, matrix: matrix }];
}
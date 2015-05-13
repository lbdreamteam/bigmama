LBPixelPerfectCollisionComponent = function () {
    this.spriteCollisionMatrix = {};
}

LBPixelPerfectCollisionComponent.prototype = Object.create(Object);
LBPixelPerfectCollisionComponent.prototype.constructor = LBPixelPerfectCollisionComponent;

//Verifica se sprite1 e sprite2 (phaser.Sprite) sono in collisione con una pixel perfect collision
LBPixelPerfectCollisionComponent.prototype.CheckPixelPerfectCollision = function (sprite1, sprite2){
    //Creo due oggetti che hanno le coordinate vere dei due sprite
    var realSprite1 = this.getRealCoord(sprite1);
    var realSprite2 = this.getRealCoord(sprite2);
    //Controllo se i due oggetti si intersecano (prima sull'asse x perchè è più significativo)
    if (this.CheckAxisIntersection(realSprite1, realSprite2, "x") && this.CheckAxisIntersection(realSprite1, realSprite2, "y")){
        //Controllo delle intersezioni dei rettangoli
        var matrix1 = this.spriteCollisionMatrix[sprite1.key];
        var matrix2 = this.spriteCollisionMatrix[sprite2.key];
        var vect21 = {
            x: realSprite2.x - realSprite1.x,
            y: realSprite2.y - realSprite1.y
        };
        for (var i = 0; i < matrix1.length; i++)
            for (var j = 0; j < matrix2.length; j++){
                if (this.CheckRectangleIntersection(matrix1[i], matrix2[j], vect21)){
                    //Se due rettangoli si intersecano, devo chiamare la ppc vera e propria
                    var vectm2m1 = {
                        x: matrix2[j].topleft.x + vect21.x - matrix1[i].topleft.x,
                        y: matrix2[j].topleft.y + vect21.y - matrix1[i].topleft.y
                    };
                    if (this.CheckRectanglePerfectCollision(matrix1[i], matrix2[j], vectm2m1))
                        return true;
                }
            }
    }
    return false;
}

//funzione che prende un Phaser.sprite e restituisce un oggetto con le variabili x,y,width,height reali
LBPixelPerfectCollisionComponent.prototype.getRealCoord = function (sprite){
    return {
        x: Math.floor(sprite.x - sprite.anchor.x * sprite.width),
        y: Math.floor(sprite.y - sprite.anchor.y * sprite.height),
        width: sprite.width,
        height: sprite.height
    };
}

//funzione che controlla se due oggetti sono sovrapposti su una coordinata
//ritorna vero se i due oggetti si sovrappongono su quella coordinata
//axis va passata come string. "x" o "y"
LBPixelPerfectCollisionComponent.prototype.CheckAxisIntersection = function (sprite1, sprite2, axis){
    var dim = axis === "x" ? "width" : "height";
    if (sprite1[axis] < sprite2[axis])
        return sprite1[axis]+sprite1[dim] > sprite2[axis];
    else
        return sprite2[axis]+sprite2[dim] > sprite1[axis];
}

//funzione che controlla se due rettangoli (oggetti con topleft e bottomright) si sovrappongono
//vect è il vettore che contiene la posizione di sprite2 rispetto a sprite1
LBPixelPerfectCollisionComponent.prototype.CheckRectangleIntersection = function (rect1, rect2, vect){
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
    return this.CheckAxisIntersection(rect1b,rect2b,"y") && this.CheckAxisIntersection(rect1b,rect2b,"x");
}

//funzione che effettua la vera e propria pixel perfect collision tra due matrici di punti
//vect contiene la posizione di rect1 rispetto a rect2
LBPixelPerfectCollisionComponent.prototype.CheckRectanglePerfectCollision = function (rect1, rect2, vect){
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
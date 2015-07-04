LBText = function (baseFont, text, x, y, Wspacing, Hspacing, color) {

    if (Wspacing == undefined) { Wspacing = 40; }
    if (Hspacing == undefined) { Wspacing = 40; }
    if (baseFont == undefined) { baseFont = new LBFont('small', false, false); }

    this.text = text;
    this.t_x = x;
    this.t_y = y;
    this.text_font = baseFont;
    this.ASCII = []; //contiene le singole lettere della stringa
    this.color = color;

    this.t_Texture;

    this.t_Wspacing = Wspacing;
    this.t_Hspacing = Hspacing;

    this.sprites = [];

    this.create();
}



LBText.prototype = Object.create(Phaser.Sprite.prototype);
LBText.prototype.constructor = LBText;

LBText.prototype.create = function () {
    this.stringHandler(this.text);
    this.textDrawer(this.text);
}

LBText.prototype.stringHandler = function (txt) {

    for (var i = 0; i < txt.length; i++) {
        this.ASCII[i] = txt.charCodeAt(i);
    }
}

LBText.prototype.textDrawer = function (txt) {

    var ycount = 0;
    var xcount= 0;
    var count = 0;

    for (var i = 0; i < txt.length; i++) {
        if (this.ASCII[i-1] == 47 && this.ASCII[i] ==114 ) {
            this.sprites[count - 1].kill();
            ycount += this.t_Hspacing;            // se la stringa contiente un / azzera il contatore delle x e aggiorna quello delle y
            xcount = 0;
        }
        else {
            this.sprites[count] = gameInstance.phaserGame.add.sprite( xcount * this.t_Wspacing, ycount, gameInstance.phaserGame.cache.getBitmapData(this.ASCII[i]));
            this.sprites[count].tint = this.color;
            xcount++; //aggiorna il contatore delle x
            count++;
        }
    }
    this.MergeText(count);

 }

LBText.prototype.getMax = function () { // ricava la lettera con la coordinata x più elevata

    var temp =0;
    var max;


    for (var i = 0; i < this.sprites.length; i++) {

        if (i == 0) {
            max = i
            temp = max;
        }
         else if (this.sprites[i].x  > this.sprites[i - 1].x && this.sprites[i].x > this.sprites[temp].x && this.sprites[i].alive) {

            max = i
            temp = max;
        }

    }

    return this.sprites[max];
}

LBText.prototype.MergeText = function (count) {  //trasforma l'insieme di sprite delle lettere in un unico sprite che le comprende tutte


    var maxSprite = this.getMax();

    this.t_Texture = gameInstance.phaserGame.add.renderTexture(maxSprite.x + maxSprite.width, this.sprites[count - 1].y + this.sprites[count - 1].height + 10);

    this.t_Texture.clear();

    for (var i = 0; i < this.sprites.length; i++) {  

        this.t_Texture.render(this.sprites[i], this.sprites[i].position, false);
        this.sprites[i].kill();
    }

    Phaser.Sprite.call(this, gameInstance.phaserGame, this.t_x, this.t_y, this.t_Texture);
    gameInstance.phaserGame.add.existing(this);
}
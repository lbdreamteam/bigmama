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

    this.t_Wspacing = Wspacing;
    this.t_Hspacing = Hspacing;

    this.sprites = [];

    this.create();
}



LBText.prototype = Object.create(Object);
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

    var ycount = this.t_y;
    var xcount= 0;

    for (var i = 0; i < txt.length; i++) {
        if (this.ASCII[i-1] == 47 && this.ASCII[i] ==114 ) {
            this.sprites[i - 1].kill();
            ycount += this.t_Hspacing;            // se la stringa contiente un / azzera il contatore delle x e aggiorna quello delle y
            xcount = 0;
        }
        else {
            this.sprites[i] = gameInstance.phaserGame.add.sprite(this.t_x + xcount * this.t_Wspacing, ycount, gameInstance.phaserGame.cache.getBitmapData(this.ASCII[i]));
            this.sprites[i].tint = this.color;
            xcount++; //aggiorna il contatore delle x
        }
    }
}

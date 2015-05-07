LBText = function (baseFont, text, x, y, spacing) {

    if (spacing == undefined) { spacing = 40; }

    this.text = text;
    this.t_x = x;
    this.t_y = y;
    this.text_font = baseFont;
    this.ASCII = []; //contiene le singole lettere della stringa

    this.t_spacing = spacing;

    this.create();
}

LBText.prototype = Object.create(Object);
LBText.prototype.constructor = LBText;

LBText.prototype.create = function () {
    console.log('istanziato text');
    this.stringHandler(this.text);
    this.textDrawer(this.text);
}

LBText.prototype.stringHandler = function (txt) {

    for (var i = 0; i < txt.length; i++) {
        this.ASCII[i] = txt.charCodeAt(i);
        console.log(this.ASCII[i]);
    }
}

LBText.prototype.textDrawer = function (txt) {
    for (var i = 0; i < txt.length; i++)
        gameInstance.phaserGame.add.sprite(this.t_x+i * this.t_spacing, this.t_y, gameInstance.phaserGame.cache.getBitmapData(this.ASCII[i]));
}
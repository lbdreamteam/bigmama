LBText = function (baseFont, text, x, y, Wspacing,Hspacing) {

    if (Wspacing == undefined) { Wspacing = 40; }
    if (Hspacing == undefined) { Wspacing = 40; }

    this.text = text;
    this.t_x = x;
    this.t_y = y;
    this.text_font = baseFont;
    this.ASCII = []; //contiene le singole lettere della stringa

    this.t_Wspacing = Wspacing;
    this.t_Hspacing = Hspacing;
    
    this.base_rgba = {
        r: 0,
        g: 0,
        b: 0,
        a: 0
    }

    this.rgba = [];

    this.create();
}



LBText.prototype = Object.create(Object);
LBText.prototype.constructor = LBText;

LBText.prototype.create = function () {
    console.log('istanziato text');
    this.stringHandler(this.text);
    this.textDrawer(this.text);
    this.setRGBAProp(this.text_font, this.rgba);
    this.getPixelColor(this.text_font, this.rgba);
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
        if (this.ASCII[i] == 47) {
            ycount += this.t_Hspacing;            // se la stringa contiente un / azzera il contatore delle x e aggiorna quello delle y
            xcount = 0;
        }
        else {
            xcount++;  //aggiorna il contatore delle x
            gameInstance.phaserGame.add.sprite(this.t_x + xcount * this.t_Wspacing, ycount, gameInstance.phaserGame.cache.getBitmapData(this.ASCII[i]));
        }
    }
}

LBText.prototype.getPixelColor = function (font, rgba) {

}

LBText.prototype.setRGBAProp = function (font, rgba) {

  
}

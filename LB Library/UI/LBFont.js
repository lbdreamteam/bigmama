LBFont = function (scale, italic, bold) {
    if (scale == undefined || (scale != "h1" && scale != "h2" && scale != "h3")) { scale = "h1"; }
    if (italic == undefined) { italic = false; }
    if (bold == undefined) { bold = false; }



    this.scale = scale; //Grandezza del carattere (h1, h2, h3)
    this.italic = italic;
    this.bold = bold;

    this.char = []; //Array dei caratteri ascii
    this.fwidth = [];
    this.fheight = [];
    this.fx = [];
    this.fy = [];
    this.single_char = [];
    this.rect = [];
    this.bmd = [];

    this.create();
}

LBFont.prototype = Object.create(Object);
LBFont.prototype.constructor = LBFont;

LBFont.prototype.create = function () {

    //Set degli array
    this.loadFontProps(this.char, "id");
    this.loadFontProps(this.fwidth, "width");
    this.loadFontProps(this.fheight, "height");
    this.loadFontProps(this.fx, "x");
    this.loadFontProps(this.fy, "y");
    this.imageHandler();
}

LBFont.prototype.loadFontProps = function (arr, attribute) {
    //Viene caricato il documento XML del font
    xml = new XMLHttpRequest;
    xml.open("GET", "assets/font.xml", false);
    xml.send();
    xmlDoc = xml.responseXML;

    count = xmlDoc.getElementsByTagName('chars')[0].getAttribute('count');

    for (i = 0; i <= count; i++) {
        arr[i] = xmlDoc.getElementsByTagName('char')[i].getAttribute(attribute);

    }
}

LBFont.prototype.imageHandler = function () {

    console.log('imageHandler partito');


    var font_img = gameInstance.phaserGame.cache.getImage('font_table');

    var font_bitmap = gameInstance.phaserGame.add.bitmapData(font_img.width, font_img.height);
    
    for (var i = 0; i < this.char.length - 1; i++)
        this.getPixels(font_img, font_bitmap, i);

    for (var i = 0; i < this.char.length - 1; i++)
        this.createChar( i);

  
}

LBFont.prototype.getPixels = function (im, bmd, count) {
    
    bmd.addToWorld();

    bmd.draw(im, 0, 0);

    this.rect[count] = new Phaser.Rectangle(this.fx[count], this.fy[count], this.fwidth[count], this.fheight[count]);
    this.single_char[count] = bmd.getPixels(this.rect[count]);

    bmd.clear();

}

LBFont.prototype.createChar = function (count) {

    //bmd.resize(this.fwidth[count], this.fheight[count]);
    this.bmd[count] = gameInstance.phaserGame.add.bitmapData(this.rect[count].width,this.rect[count].height);
    this.bmd[count].ctx.putImageData(this.single_char[count], 0, 0);
    gameInstance.phaserGame.cache.addBitmapData(this.char[count], this.bmd[count]);
}


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

    this.create();
}

LBFont.prototype = Object.create(Object);
LBFont.prototype.constructor = LBFont;

LBFont.prototype.create = function () {

    //Set degli array
    this.fillArray(this.char, "id");
    this.fillArray(this.fwidth, "width");
    this.fillArray(this.fheight, "height");
    this.fillArray(this.fx, "x");
    this.fillArray(this.fy, "y");
    this.imageHandler();
}

LBFont.prototype.fillArray = function (arr, attribute) {
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


    var im = gameInstance.phaserGame.cache.getImage('font_table');

    var bmd = gameInstance.phaserGame.add.bitmapData(gameInstance.width, gameInstance.height);

    // funzioni da gestire con il depth group
    // bmd.addToWorld();

    //bdm.draw(im, 0, 0);

    for (var i = 0; i < this.char.length - 1; i++) {

        this.rect[i] = new Phaser.Rectangle(this.fx[i], this.fy[i], this.fwidth[i], this.fheight[i]);
        this.single_char[i] = bmd.getPixels(this.rect[i]).data;

    }

    //funzione che mostra la lettera a 
    // bmd.ctx.putImageData(this.rect[0], x, y);
}


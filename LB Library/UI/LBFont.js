LBFont = function (scale, italic, bold) {
    if (scale == undefined || ( scale != "h1" && scale != "h2" && scale != "h3")) { scale = "h1"; }
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

    for (i = 0; i <= count; i++)
    {
        arr[i] = xmlDoc.getElementsByTagName('char')[i].getAttribute(attribute);
       
    }
}

LBFont.prototype.imageHandler = function () {

    console.log('imageHandler partito');

    for (var i = 0; i < this.char.length; i++) {
        var im = gameInstance.phaserGame.cache.getImage('font_table');
        var rect = new Phaser.Rectangle(this.fx[i], this.fy[i], this.fwidth[i], this.fheight[i]);
        var bm = new Phaser.BitmapData(gameInstance.phaserGame, 'bitmap_font', im.width, im.height);
        bm.draw(im);
        bm.update();
        this.single_char[i] = bm.getPixels(rect);
    }
}

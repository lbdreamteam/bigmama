//http://kvazars.com/littera/  generatore font

LBFont = function (scale, italic, bold) {
    if (scale == undefined || (scale != "small" && scale != "medium" && scale != "large")) { scale = "small"; }
    if (italic == undefined) { italic = false; }
    if (bold == undefined) { bold = false; }

    this.scale = scale; //Grandezza del carattere (small, medium, large)
    this.italic = italic;
    this.bold = bold;

    this.char_ASCII = []; //Array dei caratteri ascii
    this.f_width = [];
    this.f_height = [];
    this.f_x = [];
    this.f_y = [];
    this.single_char_data = []; //Contiene ImageData
    this.rect = [];
    this.bmd = []; //BitmapData
    this.img = gameInstance.phaserGame.cache.getImage('font_table_' + this.scale);

    this.create();
}

LBFont.prototype = Object.create(Object);
LBFont.prototype.constructor = LBFont;

LBFont.prototype.create = function () {

    //Set degli array
    this.loadFontProps(this.char_ASCII, "id");
    this.loadFontProps(this.f_width, "width");
    this.loadFontProps(this.f_height, "height");
    this.loadFontProps(this.f_x, "x");
    this.loadFontProps(this.f_y, "y");
    this.imageHandler();
}

LBFont.prototype.loadFontProps = function (arr, attribute) {
    //Viene caricato il documento XML del font
    xml = new XMLHttpRequest;
    xml.open("GET", "assets/font_" + this.scale + "/font.xml", false);
    xml.send();
    xmlDoc = xml.responseXML;

    count = xmlDoc.getElementsByTagName('chars')[0].getAttribute('count');

    for (i = 0; i <= count; i++) {
        arr[i] = xmlDoc.getElementsByTagName('char')[i].getAttribute(attribute);

    }
}

LBFont.prototype.imageHandler = function () {

    var font_img = gameInstance.phaserGame.cache.getImage('font_table_' + this.scale);

    var font_bitmap = gameInstance.phaserGame.add.bitmapData(font_img.width, font_img.height);
    
    font_bitmap.addToWorld();

    font_bitmap.draw(font_img, 0, 0);

    for (var i = 0; i < this.char_ASCII.length - 1; i++)
        this.getPixels(font_img, font_bitmap, i);

    font_bitmap.clear();

    for (var i = 0; i < this.char_ASCII.length - 1; i++)
        this.createChar( i);

  
}

LBFont.prototype.getPixels = function (im, bmd, count) {
    
    this.rect[count] = new Phaser.Rectangle(this.f_x[count], this.f_y[count], this.f_width[count], this.f_height[count]);
    this.single_char_data[count] = bmd.getPixels(this.rect[count]);
}

LBFont.prototype.createChar = function (count) {
   
    this.bmd[count] = gameInstance.phaserGame.make.bitmapData(this.rect[count].width,this.rect[count].height);
    this.bmd[count].ctx.putImageData(this.single_char_data[count], 0, 0);
    gameInstance.phaserGame.cache.addBitmapData(this.char_ASCII[count], this.bmd[count]);
}


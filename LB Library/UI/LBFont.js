LBFont = function (scale, italic, bold) {
    if (scale == undefined || ( scale != "h1" && scale != "h2" && scale != "h3")) { scale = "h1"; }
    if (italic == undefined) { italic = false; }
    if (bold == undefined) { bold = false; }

    this.scale = scale; //Grandezza del carattere (h1, h2, h3)
    this.italic = italic;
    this.bold = bold;

    this.char = []; //Array dei caratteri ascii
    this.width = []; 
    this.height = []; 
    this.x = [];
    this.y = [];

    //TODO: non va da solo il create
    this.create();
}

LBFont.prototype = Object.create(Object);
LBFont.prototype.constructor = LBFont;

LBFont.prototype.create = function () {
    
    //Set degli array
    LBFont.prototype.fillArray(this.char, "id");
    LBFont.prototype.fillArray(this.width, "width");
    LBFont.prototype.fillArray(this.height, "height");
    LBFont.prototype.fillArray(this.x, "x");
    LBFont.prototype.fillArray(this.y, "y");

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
        //console.log(arr[i]);
    }
}
//TODO: creare funzione per ritaglio immagine lettera e associare l'immagine al carattere
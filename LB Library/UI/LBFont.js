xml = new XMLHttpRequest;
xml.open("GET", "assets/font.xml", false);
xml.send();
xmlDoc = xml.responseXML;

//getElementsByTagName è un array che contiene tutte le tag del tipo specificato nel parametro nel file xml
//childNodes[0].nodeValue è la propietà della tag che contiene il suo valore in stringa

    console.log("");
    console.log("Autore: " + xmlDoc.getElementsByTagName("chars")[0].childNodes[0].nodeValue);


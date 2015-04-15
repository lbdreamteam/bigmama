xml = new XMLHttpRequest;
xml.open("GET", "assets/font.xml", false);
xml.send();
xmlDoc = xml.responseXML;
//mlDoc = loadXMLDoc("assets/font.xml");

//getElementsByTagName è un array che contiene tutte le tag del tipo specificato nel parametro nel file xml
//get attribute ritorna il valore dell attributo specificato nel parametro appartenente alla tag specificata da getElementsByTagName



    console.log("Caratteristiche della lettera a del font:");
    console.log("Id: " + xmlDoc.getElementsByTagName("char")[0].getAttribute('id'));
    console.log("x: " + xmlDoc.getElementsByTagName("char")[0].getAttribute('x'));
    console.log("y: " + xmlDoc.getElementsByTagName("char")[0].getAttribute('y'));
    console.log("width: " + xmlDoc.getElementsByTagName("char")[0].getAttribute('width'));
    console.log("height: " + xmlDoc.getElementsByTagName("char")[0].getAttribute('height'));


var express = require("express"),
    bodyparser = require("body-parser"),
    mysql = require('mysql');
    app = express(),
    connection = mysql.createConnection({
        host: '31.170.164.30',
        //port: '3306',
        user: 'u309167566_tc',
        password: 'Spallanzani1'
    });

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

var router = express.Router();

router.get('/', function (req, res) {
    try {
        connection.connect();
        console.log('Connessione aperta..');
        connection.end();
    }
    catch (ex) {
        console.log('Exception: ' + ex);
    }
    console.log('Redirecting --Req ' + req);
    res.redirect('http://localhost:8001');

    //res.json({ response: 'Ciao' });
});

app.use('/api', router);

app.listen(process.env.PORT || 8080);
console.log('Partito...');
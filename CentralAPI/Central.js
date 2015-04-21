var express = require("express"),
    bodyparser = require("body-parser"),
    mysql = require('mysql'),
    app = express(),
    crypto = require('crypto'),
    //LBModules
    LBServerInstance = require('./ServerModules/LBServerModule.js'),
    connection = mysql.createConnection({
        host: 'host2trialcode.ddns.net',
        port: '3306',
        database: 'trialcode_test',
        user: 'test',
        //password: 'Spallanzani1'
    }),
    instances = {};

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

var router = express.Router();

//QUESTO PERMETTE LE CHIAMATE CROSS DOMAIN
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/:param', function (req, res) {
    console.log(req.params.param);
    res.json({ response: req.params.param });
    //connection.connect(function (err) {
    //    if (err) {
    //        console.log('Error while connecting to database: ' + err.stack);
    //        return
    //    }
    //    console.log('Connessione aperta --ID: ' + connection.threadId);
    //});
    ////connection.query('INSERT INTO test(Nome, Token) VALUES("abc", "def");', function (error, results, fields) {
    ////    if (error) {
    ////        console.log('ERROR at query: ' + error.stack);
    ////        return
    ////    }
    ////    console.log('Inserted!');
    ////});
    //connection.query('SELECT * FROM test;', function (err, results, fieds) {
    //    if (err) {
    //        console.log('ERROR at SELECT ' + err.stack);
    //        return
    //    }
    //    for (var result in results) console.log(result);
    //    res.json({ response: { resuilts: results, fieds: fieds } });
    //})
    //try {
    //    connection.connect();
    //    console.log('Connessione aperta..');
    //    connection.end();
    //}
    //catch (ex) {
    //    console.log('Exception: ' + ex);
    //}
    //console.log('Redirecting --Req ' + req);
    //res.redirect('http://localhost:8001');

    ////res.json({ response: 'Ciao' });
});

router.get('/redirect/:uId/:iId', function (req, res) {
    var uId = req.params.uId,
        iId = req.params.iId;
    connection.query('INSERT INTO authTokens(uId, iId, token) VALUES(?, ?, "hashash");', [uId, iId], function (err) {
        if (err) {
            console.error('Error: ' + err.stack);
            return
        }
        console.log('Created Token for user: ' + uId + ' for instance: ' + iId);
    })
    res.redirect('http://localhost:8001');
});

router.get('/auth/:uId/:iId', function (req, res) {
    var uId = req.params.uId,
        iId = req.params.iId;
    console.log('Received authentication request from istance: ' + iId + ' for client: ' + uId);
    connection.query('SELECT token FROM authTokens WHERE uId = ? AND iId = ?;', [uId, iId], function (err, results, fields) {
        if (err) {
            console.error(err.stack);
            res.json({ error: err.stack });
        }
        if (results.length == 0) {
            console.log(uId + ' failed authentication!');
            res.json({ response: false });
        }
        else {
            connection.query('DELETE FROM authTokens WHERE uId = ? AND iId = ?;', [uId, iId], function (err) {
                if (err) {
                    console.error(err.stack);
                    return
                }
                console.log('Token used.');
            });
            console.log(uId + ' autorized');
            res.json({ response: true });
        }
    });
});

router.get('/createNew', function (req, res) {
    var response = LBServerInstance.create();
    res.json({ response: response });
})

app.use('/api', router);

app.listen(process.env.PORT || 8080);
console.log('Central API started...');
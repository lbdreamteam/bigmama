var express = require("express"),
    bodyparser = require("body-parser"),
    exec = require('child_process').exec,
    AWS = require('aws-sdk'),
    app = express();

AWS.config.update({ region: 'eu-west-1' });

var dynDB = new AWS.DynamoDB();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

var router = express.Router();

//QUESTO PERMETTE LE CHIAMATE CROSS DOMAIN
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/loadPorts/:startPort/:max/:pullSize', function (req, res) {
    var lastPort = parseInt(req.params.startPort);
    for (var i = 0; i < req.params.max/req.params.pullSize; i++) {
        var portPull = []
        for (var j = 0; j < req.params.pullSize; j++) {
            portPull[j] = (lastPort + j).toString();
            console.log(portPull[j]);
        }
        lastPort += parseInt(req.params.pullSize);
        dynDB.putItem({
            'TableName': 'ports',
            'Item': {
                'index': {
                    'N' :  i.toString()
                },
                'pull': {
                    'NS' : portPull
                }
            }
        }, function (err) {
            if (err) res.json({err: err })
        });
    }
    console.log('Port Loaded --From ' + req.params.startPort + ' --Til ' + req.params.max);
    res.json({ response: 'Port Loaded --From ' + req.params.startPort + ' --Til ' + req.params.max });
});

router.get('/redirect/:port', function (req, res) {
    res.redirect('http://52.17.92.120:' + req.params.port);
});

router.get('/create', function (req, res) {
    var index = Math.floor(Math.random() * 10);
    dynDB.getItem({
        'AttributesToGet' : ['pull'],
        'Key': {
            'index': {
                'N': index.toString()
            }
        },
        'TableName': 'ports'
    }, function (err, data) {
        if (err) res.json({ err: err })
        else {
            var port = data.Item.pull.NS[Math.floor(Math.random() * data.Item.pull.NS.length)];
            console.log('pulllength : ' + data.Item.pull.NS.length + ' port: ' + port);
            dynDB.updateItem({
                'UpdateExpression': 'DELETE pull :port',
                'ExpressionAttributeValues' : {
                    ':port' : {
                        'NS' : [port.toString()]
                    }
                },
                'Key': {
                    'index': {
                        'N': index.toString()
                    }
                },
                'TableName' : 'ports',
                'ReturnValues': 'UPDATED_NEW'
            }, function (err, data) {
                if (err) res.json({ err: err })
                else {
                    var child;
                    child = exec('node server.js ' + port);
                    console.log('Started game on port: ' + port);
                    child = exec('aws ec2 authorize-security-group-ingress --group-id sg-0787d562 --protocol tcp --port ' + port + ' --cidr 0.0.0.0/0 --region eu-west-1');
                    console.log('Opened port: ' + port);
                    res.redirect('http://52.17.92.120:' + port);
                }
            });
        }
    });
});

app.use('/api', router);

app.listen(process.env.PORT || 8080);
console.log('Central API started...');
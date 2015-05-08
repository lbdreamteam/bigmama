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

router.get('/', function(req, res) {});

//QUESTO PERMETTE LE CHIAMATE CROSS DOMAIN
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/loadPorts/:startPort/:max/:pullSize', function (req, res) {
    
});

router.get('/redirect/:port', function (req, res) {
    res.redirect('http://52.17.92.120:' + req.params.port);
});

router.get('/create', function (req, res) {
    
});

router.get('/kill/:port', function (req, res) {
    
});

//router.get('/test', function (req, res) {
//    dynDB.updateItem({
//        'UpdateExpression': 'ADD pull :port',
//        'ConditionExpression': 'NOT contains ( pull, :port)',
//        'ExpressionAttributeValues': {
//            ':port': {
//                'NS': ['9013']
//            }
//        },
//        'Key': {
//            'index': {
//                'N': '2'
//            }
//        },
//        'TableName': 'ports'
//    }, function (err, data) {
//        if (err) res.json({ err: err })
//        else res.json({ response: data });
//    });
//});

app.use('/api', router);

app.listen(process.env.PORT || 8080);
console.log('Central API started...');
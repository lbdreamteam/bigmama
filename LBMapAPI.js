var express = require('express'),
	LBApi = require('./APIsModules/LBAPIModule.js'),
    //VARIABILI DI QUESTA SPECIFICA API
    dynDB,
    s3;

LBApi.create(
	'8082',
	'eu-west-1',
	[
        {
            'action': 'test',
            'params': ['nome'],
            'function': function (params, res) {
                res.json({ response: params.nome + ' sono la MAP API' });
            }
        },

		{
		    'action': 'createMap',
		    'params': ['port'],
		    'function': generateMap
		},

        {
            'action': 'downloadMap',
            'params': ['port'],
            'function': downloadMap
        }
	],
    function (APIInstance) {
        dynDB = new APIInstance.modules['aws-sdk'].DynamoDB();
        s3 = new APIInstance.modules['aws-sdk'].S3();

        console.log(APIInstance.modules['cli-color'].red.bgWhite('LBMapApi v0.0.1.2'));
    }
);

function generateMap(params, res) {

    MapJSON = {
        world: {},
        graphs: {
            buildingsGraphs: [],
            sidewalkGraph: {},
            roadGraphs: {},
            foregroundGraph: {},
            backgroundGraph: {}
        },
        proportions: {},
        buildingsArray: []
    }

	fillJSON(params.port, MapJSON, res);	
}

function fillJSON(port, MapJSON, res) {
	const worldX = 1500,
		  worldY = 720;	

	const roadProportion = 1 / 2,
		  sidewalkProportion = 1 / 10,
		  foregroundProportion = 1 / 10;

	MapJSON.world = { width: worldX, height: worldY };
	MapJSON.proportions = { road: roadProportion, sidewalk: sidewalkProportion, foreground: foregroundProportion}

	var graphsJSON = {};
	s3.getObject(
		{Bucket: "lbbucket", Key: "graphsJSON.json"},
		function (error, data) {
			if (error) {
		  		console.log("Failed to retrieve an object: " + error);
    		} 
    		else {
      			console.log("Loaded " + data.ContentLength + " bytes");
      			graphsJSON = JSON.parse(data.Body.toString('utf8'));

      			MapJSON.graphs.backgroundGraph = { key: getRandomString(8), url: graphsJSON.backgrounds[getRandomInt(0, graphsJSON.backgrounds.length)].url };
      			MapJSON.graphs.foregroundGraph = { key: getRandomString(8), url: graphsJSON.foregrounds[getRandomInt(0, graphsJSON.foregrounds.length)].url };
      			MapJSON.graphs.roadGraphs = {
      			    road: { key: getRandomString(8), url: graphsJSON.roads[getRandomInt(0, graphsJSON.roads.length)].url },
      			    roadLine: { key: getRandomString(8), url: graphsJSON.roadLines[getRandomInt(0, graphsJSON.roadLines.length)].url }
      			}
      			MapJSON.graphs.sidewalkGraph = { key: getRandomString(8), url: graphsJSON.sidewalks[getRandomInt(0, graphsJSON.sidewalks.length)].url }

                //EDIFICI
      			for (x = 0; x <= worldX; x) {
      			    var temp = graphsJSON.buildings[getRandomInt(0, graphsJSON.buildings.length)];
      			    var tempX;

      			    tempX = getRandomInt(0, Math.round(temp.width / 2));

      			    if (x + tempX + temp.width < worldX) {

      			        if (checkBuildingAlreadyAdded(MapJSON.graphs.buildingsGraphs, temp.url)) {
      			            MapJSON.buildingsArray.push({ x: x + tempX, graph: MapJSON.graphs.buildingsGraphs[getBuildingAlreadyAddedIndex(MapJSON.graphs.buildingsGraphs, temp.url)].key });
      			        }
      			        else {
      			            var key = getRandomString(8);
      			            MapJSON.graphs.buildingsGraphs.push({ key: key, url: temp.url });
      			            MapJSON.buildingsArray.push({ x: x + tempX, graph: key });
      			        }

      			    }

      			    //console.log('x: ' + x + '  tempX: ' + tempX + '  temp.width: ' + temp.width + '  temp.angleX: ' + temp.angleX);

      			    if (temp.hasOwnProperty('angleX')) {

      			        x = x + tempX + temp.angleX;
      			    }
      			    else {
      			        x = x + tempX + temp.width;
      			    }

      			    //console.log('new x: ' + x);
      			    //console.log();
                    
      			}


      			console.log(MapJSON);
      			dynDB.updateItem({
      			    'TableName': 'activeGames',
      			    'UpdateExpression': 'SET #map = :smap',
      			    'Key': {
      			        'port': {
      			            'N': port.toString()
      			        }
      			    },
      			    'ExpressionAttributeNames' : {
                        '#map' : 'map'
      			    },
      			    'ExpressionAttributeValues': {
      			        ':smap': {
      			            'S': JSON.stringify(MapJSON)
      			        },
      			        ':val': {
      			            'S': '-->MAP<--'
      			        }
      			    },
      			    'ConditionExpression': '#map = :val'
      			}, function (err, data) {
      			    if (err) {
      			        console.log('AWS Dynamo DB error: ' + err);
      			        res.statusCode = 601;
      			        res.send('AWS Dynamo DB');
      			    }
      			    else res.json({ response: true })
      			});
    		}
		}
	);


}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomString(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function checkBuildingAlreadyAdded (entry, prop) {
    for (var i = 0; i < entry.length; i++) if (entry[i].url == prop) return true;
}

function getBuildingAlreadyAddedIndex(entry, prop) {
    for (var i = 0; i < entry.length; i++) if (entry[i].url == prop) return i;
}


function downloadMap(params, res) {
    dynDB.getItem({
        'AttributesToGet': [
            'map'
        ],
        'TableName': 'activeGames',
        'Key': {
            'port': {
                'N': params.port.toString()
            }
        }
    },
    function (err, data) {
        if (err) {
            console.log('AWS Dynamo DB error: ' + err);
            res.statusCode = 601;
            res.send('AWS Dynamo DB');
        }
        else res.json({ response: JSON.parse(data.Item.map.S) })
    });
}
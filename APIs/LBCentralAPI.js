var express = require('express'),
	LBApi = require('./ServerModules/LBAPIModule.js'),
	//VARIABILI DI QUESTA SPECIFICA API
	dynDB,
	exec,
    http;

LBApi.create(
	'8081', 
	'eu-west-1', 
	[
		{
			'action' : 'test',
			'params' : ['nome'],
			'function' : function(params, res) {
				res.json({response : 'test'});
			}
		},

		//LOAD PORTS
		{
			'action' : 'loadPorts' , 
			'params' : ['startPort', 'max', 'pullSize'], 
			'function' : function(params, res) {
				var lastPort = parseInt(params.startPort),
                    dynDBParams = {
                        'RequestItems' : {
                            'ports' : []
                        }
                    };
					for (var i = 0; i < params.max/params.pullSize; i++) {
        			    var portPull = []
        			    for (var j = 0; j < params.pullSize; j++) {
            			    portPull[j] = (lastPort + j).toString();
        			    }
        			    lastPort += parseInt(params.pullSize);
        			    dynDBParams.RequestItems.ports.push({
                            'PutRequest' : {
                                'Item' : {
                                    'index' : {
                                        'N' : i.toString()
                                    },
                                    'pull' : {
                                        'NS' : portPull
                                    }
                                }
                            }
                        });
        			}
                dynDB.batchWriteItem(dynDBParams, function(err, data) {
    			     if (err) res.json({err: err})
                     else res.json({response : 'Completed'})
                });
			}
		},

		//CREATE
		{
			'action' : 'create',
			'params' : [],
			'function' : function(params, res) {
				var pullIndex = Math.floor(Math.random() * 20);
    			dynDB.getItem({
        			'AttributesToGet' : ['pull'],
        			'Key': {
            			'index': {
                			'N': pullIndex.toString()
            			}
        			},
        			'TableName': 'ports'
    			}, function (err, data) {
        			if (err) console.log(err);
        			else {
            			var port = data.Item.pull.NS[Math.floor(Math.random() * data.Item.pull.NS.length)];
            			console.log('pulllength : ' + data.Item.pull.NS.length + ' port: ' + port);
            			dynDB.updateItem({
                			'UpdateExpression': 'DELETE pull :port',
                			'ExpressionAttributeValues': {
                    			':port': {
                        			'NS': [port.toString()]
                    			}
                			},
                			'Key': {
                    			'index': {
                        			'N': pullIndex.toString()
                    			}
                			},
                			'TableName': 'ports',
                			'ReturnValues': 'UPDATED_NEW'
            			}, function (err, data) {
                			if (err) res.json({err: err});
                			else {
                    			var child;
                    			child = exec('node server.js ' + port);
                    			console.log('Started game on port: ' + port);
                    			child = exec('aws ec2 authorize-security-group-ingress --group-id sg-0787d562 --protocol tcp --port ' + port + ' --cidr 0.0.0.0/0 --region eu-west-1');
                    			console.log('Opened port: ' + port);
                    			dynDB.putItem({
                        			'TableName': 'activeGames',
                        			'Item': {
                            			'port': {
                                			'N': port.toString()
                            			},
                            			'timing': {
                                			'M': {
                                    			'init': {
                                        			'N' : Date.now().toString()
                                    			},
                                    			'start': {
                                        			'N' : '0'
                                    			},
                                    			'finish': {
                                        			'N' : '0'
                                    			},
                                    			'closed': {
                                        			'N' : '0'
                                    			}
                                			}
                            			},
                            			'state': {
                                				'S' : 'WAITING'
                            			},
                            			'players': {
                                			'M': {
                                    			'owner': {
                                        			'S' : 'NOME'
                                    			},
                                    			'hosts': {
                                        			'L' : []
                                    			}
                                			}
                            			},
                            			'map': {
                                            'S' : '-->MAP<--'
                            			}
                        			}
                    			}, function (err, data) {
                    			    if (err) res.json({ err: err });
                                    //CREA LA NUOVA MAPPA TRAMITE LA API E LA STORA IN DYNDB
                    			    else http.request({
                    			        host: '52.17.92.120',
                    			        port: '8082',
                    			        path: '/LBApi/createJson?port=' + port,
                                        method: 'GET'
                    			    }, function (MAPres) {
                    			        if (MAPres.err) res.json(MAPres)
                    			        else if (MAPres.response) res.redirect('http://52.17.92.120:' + port);
                    			    }).end();
                    			});
                			}
            			});
        			}
    			});
			}
		},

		//KILL
		{
			'action' : 'kill',
			'params' : ['port'],
			'function' : function(params, res) {
				var port = params.port;
    			dynDB.scan({
        			'TableName': 'ports',
        			'ProjectionExpression': '#index',
        			'FilterExpression': 'size (pull) < :val',
        			'ExpressionAttributeNames' : {
            			'#index': 'index'
        			},
        			'ExpressionAttributeValues': {
            			':val': {
                			'N' : '5'
            			}
        			}
    			}, function (err, data) {
        			if (err) res.json({ err: err })
        			else {
            			if (!data.Count) res.json({ err: 'ALERT! SEEMS TO BE NO GAME TO CLOSE!' })
            			else {
                			var pullIndex = data.Items[Math.floor(Math.random() * (data.Count - 1))].index.N;
                			dynDB.updateItem({
                    			'UpdateExpression': 'ADD pull :port',
                    			'ConditionExpression': 'NOT contains ( pull, :port )',
                    			'ExpressionAttributeValues': {
                        			':port': {
                            			'NS': [port.toString()]
                        			}
                    			},
                    			'Key': {
                        			'index': {
                            			'N': pullIndex.toString()
                        			}
                    			},
                    			'TableName': 'ports',
                    			'ReturnValues': 'UPDATED_NEW'
                			}, function (err, data) {
                    			if (err) res.json({ err: err })
                    			else {
                        			var child;
                        			child = exec('fuser -k ' + port + '/tcp');
                        			console.log('Terminated LBGame on port: ' + port);
                        			child = exec('aws ec2 revoke-security-group-ingress --group-id sg-0787d562 --protocol tcp --port ' + port + ' --cidr 0.0.0.0/0 --region eu-west-1');
                        			console.log('Closed port: ' + port);
                        			res.json({ response: true });
                    			}
                			});
            			}
        			}
    			});
			}
		}
	],
	function(APIInstance) {
		dynDB = new APIInstance.modules['aws-sdk'].DynamoDB();
		exec = APIInstance.modules['child_process'].exec;
		http = APIInstance.modules['http'];
	}
);
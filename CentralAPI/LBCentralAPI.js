var express = require('express'),
	LBApi = require('./ServerModules/LBAPIModule.js');

LBApi.create(
	'8080', 
	'eu-west-1', 
	[
		{
			'action' : 'test' , 
			'params' : ['nome', 'cognome'], 
			'function' : function(params, res) {
				res.json({response: params.nome + ' ' + params.cognome});
			}
		}
	]
);
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
require('dotenv').config();

// setup app
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({ extended: true })); 

var GoogleSpreadsheet = require("google-spreadsheet");
var sheet = new GoogleSpreadsheet('1RU812QktjYrMhsemqnC5-G2zD6I_3otnm5a_mWjtE_w');
var creds = {	
	"type": process.env.a_gs_type,
	"project_id": process.env.a_gs_project_id,
	"private_key_id": process.env.a_gs_private_key_id,
	"private_key": process.env.a_gs_private_key,
	"client_email": process.env.a_gs_client_email,
	"client_id": process.env.a_gs_client_id,
	"auth_uri": process.env.a_gs_auth_uri,
	"token_uri": process.env.a_gs_token_uri,
	"auth_provider_x509_cert_url": process.env.a_gs_auth_provider_x509_cert_url,
	"client_x509_cert_url": process.env.a_gs_client_x509_cert_url,
};

var LABEL = "(label)";
var CONTENT = "(content)";

var determineType = function (str) {
	if (!!str) {
		var type = (str.indexOf('http') > -1) ? 'link' : 'text';
		if (type == 'link') {
			if (str.indexOf('youtube') > -1) type = 'video_link';
			else if (str.indexOf('.wav') > -1) type = 'wav_link';
			else if (str.indexOf('.pdf') > -1) type = 'pdf_link';
			else if (str.indexOf('.jpg') > -1) type = 'image_link';
		}
		return type;
	} else return 'text';
}

var determineData = function (type, str) {
	if (!!str) {
		if (type == 'text' || type === 'link') return str;
		else if (type == 'video_link'){
			return str.replace('watch?v=', 'embed/');
		} 
		else {
			var index;
			if ((index = str.indexOf('dl=0')) > -1)	return str.substr(0, index) + 'raw=1';
			else if ((index = str.indexOf('dl=')) > -1) return str.substr(0, index) + 'raw=1';
		}
	} else return '';
}

var parseCell = function (cell) {
	var allObjects = [];
	var labelSplit = cell.split(LABEL);
	labelSplit.shift();
	for (var i = 0; i < labelSplit.length; i++) {
		var contentSplit = labelSplit[i].split(CONTENT);
		allObjects.push({
			label: contentSplit[0],
			content: contentSplit[1]
		});
	}
	return allObjects;
}

var getAllRows = function(callback){
	sheet.useServiceAccountAuth(creds, function(err){
	    sheet.getInfo(function(err, sheet_info){
	        sheet_info.worksheets[0].getRows(function(err, rows){
	        	var newRows = [];
	        	for (var x in rows) {
	        		newRows[x] = [];
	        		var newRowsIt = 0;
	        		for (var y in rows[x]) {
	        			if (y.indexOf('_c') > -1) {
	        				if (rows[x][y].indexOf(LABEL) > -1) {
		        				var cellObjects = parseCell(rows[x][y]);
		        				for (var z = 0; z < cellObjects.length; z++) {
		        					var labelType = determineType(cellObjects[z].label);
		        					var labelData = determineData(labelType, cellObjects[z].label); 
		        					var contentType = determineType(cellObjects[z].content);
		        					var contentData = determineData(contentType, cellObjects[z].content); 
		        					newRows[x][newRowsIt++] = {
		        						label: {type: labelType, data: labelData},
		        						content: {type: contentType, data: contentData}
		        					};
		        				}
	        				} else {
	        					var contentType = determineType(rows[x][y]);
		        				var contentData = determineData(contentType, rows[x][y]); 
		        				newRows[x][newRowsIt++] = {
		        					label: null,
		        					content: {type: contentType, data: contentData}
		        				};
	        				}        				      			
	        			}
	        		}
	        	}
	        	callback(newRows); 
	    	});
	    });
	});
};

app.get('/api/allAppData', function(req, res) {
	getAllRows(function(data){
		res.json(data); 
	});
});

module.exports = app;
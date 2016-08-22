var MongoClient = require('mongodb').MongoClient;
var config = require("./config");
var q = require('q');
var db;

module.exports.getConnection = function(callback) {
	if(!db) {
		MongoClient.connect(config.mongoUrl, function(err, database) {
			if (err) {
		    	throw err;    
		  	}
		  	console.log("Created database connection in db connection"+database);
		  	db = database;
		  	callback(db);
		});
	} else {
		console.log("Else block of get connection");
		callback(db);
	}
}

module.exports.getConn = function() {
	var deferred = q.defer();
	if (!db) {
		MongoClient.connect(config.mongoUrl, function(err, database) {
			if (err) {
		    	deferred.reject(err);    
		  	}
		  	console.log("Created database connection in db connection (using promise)"+database);
		  	db = database;
		  	deferred.resolve(db);
		});
	} else {
		deferred.resolve(db);
	}

	return deferred.promise;
}
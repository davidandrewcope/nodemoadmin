
/**
 * Module dependencies.
 */

var express = require('express')
	, mongodb = require('mongodb')
	, server = new mongodb.Server("127.0.0.1", 27017, {})
	, util = require('util')
	, Group = require('./libs/group')
	, app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'thisIsASuperSecretSessionCookieSaltString' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
	var db = new mongodb.Db('admin', server, {});
	db.open(function (error, client) {
		
		var locals = {buildinfo: {}, databases: {}};
		var results = new Array();
		
		Group(function(cb) {
	    	db.executeDbCommand({'buildinfo':1}, function(err, doc) { 
		  		if (err) throw error;
		  		 
		  		for (var i in doc.documents[0]) {
		  			locals.buildinfo[i] = doc.documents[0][i];
		  		}
		  		results.push(doc.documents);
		  		cb();
			});
	   }
	   , function(cb) {
			db.executeDbCommand({'listDatabases':1 }, function(err, doc) { 
		  		if (err) throw error;
		  		for (var i in doc.documents[0]) {
		  			locals.databases[i] = doc.documents[0][i];
		  		}
		  		results.push(doc.documents);
		  		cb();
			});
		})(function() { 
			
		    res.render('index', {
				title: 'NodeMoAdmin'
				, 'locals': locals
				, 'rawdocresults': util.inspect(results)
			});//res.render
			
		}); //Group
			
	});//db.open

});//app.get

app.get("/:database", function(req, res){
	
	var db = new mongodb.Db(req.params.database, server, {});
	
	
	
	db.open(function (err, client) {
		if (err) throw error;
		
		db.collectionNames( function(err, doc) { 
	  		if (err) throw error;
		
			res.render('database', {
				title: 'NodeMoAdmin'
				, 'collections': doc
			});
	  
		});
		
	});
	
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

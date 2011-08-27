
/**
 * Module dependencies.
 */

var express = require('express')
	, mongodb = require('mongodb')
	, server = new mongodb.Server("127.0.0.1", 27017, {})
	, util = require('util')
	, app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
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
		
		db.executeDbCommand({'listDatabases':1}, function(err, doc) { 
	  		if (error) throw error;
		
			res.render('index', {
				title: 'NodeMoAdmin'
				, locals : {
					databases: doc.documents[0].databases
					,rawdb: util.inspect(doc.documents[0].databases)
				}
			});
	  
		});
	});

});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

var express 	   = require('express'),
    cradle 		   = require('cradle'),
    path           = require('path'),
    bodyParser     = require('body-parser');

var db = new(cradle.Connection)().database('bikesystem');

var transactions = require('./routes/transactions.js');
var materials = require('./routes/materials.js');
var suppliers = require('./routes/suppliers.js');
var activities = require('./routes/activities.js');
var groups = require('./routes/groups.js');
var bikes = require('./routes/bikes.js');

var port = 3002;

var app = express();

//support json and url encoded requests
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

//Headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//Welcome
app.get('/',function(req, res){
    res.status(200).send('Welcome to the Bike System Web Service API 1.0.');
});

//Transactions
app.post('/transactions', transactions.save);
app.get('/transactions/:id', transactions.get);
app.get('/transactions', transactions.getAll);
app.put('/transactions/:id', transactions.update);
app.delete('/transactions/:id', transactions.delete);

//Materials
app.post('/items', materials.save);
app.get('/items/:id', materials.get);
app.get('/items', materials.getAll);
app.put('/items/:id', materials.update);
app.delete('/items/:id', materials.delete);

//Suppliers
app.post('/suppliers', suppliers.save);
app.get('/suppliers/:id', suppliers.get);
app.get('/suppliers', suppliers.getAll);
app.put('/suppliers/:id', suppliers.update);
app.delete('/suppliers/:id', suppliers.delete);

//Activities
app.post('/activities', activities.save);
app.get('/activities/:id', activities.get);
app.get('/activities', activities.getAll);
app.put('/activities/:id', activities.update);
app.delete('/activities/:id', activities.delete);

//Groups
app.post('/groups', groups.save);
app.get('/groups/:id', groups.get);
app.get('/groups', groups.getAll);
app.put('/groups/:id', groups.update);
app.delete('/groups/:id', groups.delete);

//Bikes
app.post('/bikes', bikes.save);
app.get('/bikes/:id', bikes.get);
app.get('/bikes', bikes.getAll);
app.put('/bikes/:id', bikes.update);
app.delete('/bikes/:id', bikes.delete);



app.listen(port);
console.log('Running on http://localhost:' + port);

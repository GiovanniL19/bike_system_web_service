var	cradle 		= require('cradle'),
    path        = require('path');

var db = new(cradle.Connection)({auth:{username:"admin", password:"9999567890"}}).database('bikesystem');


/*
 * GET Production Orders
 */
exports.getProductionOrders = function(req, res){
    var response = {
        transactions:[]
    };

    db.view('orders/ordersByInProduction', {include_docs: true}, function (err, docs) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }
        if(docs){
            docs.forEach(function(doc) {
                var item = doc.data;
                item.id = doc._id;

                item.rev = doc._rev;
                response.transactions.push(item);
            });

            res.status(200).send(response);
        }else{
            res.status(200).send([]);
        }
    });
};

/*
 * POST
 */
exports.save = function(req, res){
    var response = {
        order: null
    };
    req.body.order.type = "order";
    db.save(req.body.order, function (err, dbRes) {
        if(err){
            res.status(500).send(err)
        }else{
            response.order = dbRes;
            res.status(201).send(response);
        }
    });
};

/*
 * GET
 */
exports.get = function(req, res){
    var id = req.param("id");
    var response = {
        order: null
    };

    db.get(id, function(err, doc) {
        if (err) {
            res.status(500).send(err);
        } else {
            response.order = doc.data;
            response.order.id = doc._id;

            console.log('Retrieved ' + id + ' order by ID');
            res.status(200).send(response);
        }
    });
};

/*
 * GET
 */
exports.getAll = function(req, res){
    var response = {
        orders: []
    };

    if(req.query.orderID != undefined){
        db.get(req.query.orderID, function(err, doc) {
            if (err) {
                res.status(500).send(err);
            } else {

                var item = doc.data;
                item.id = doc._id;
                item._rev = doc._rev;
                console.log('Retrieved ' + req.query.orderID + ' order by ID');
                res.status(200).send(item);
            }
        });
    }else {
        db.view('orders/ordersByAwaitingMaterials', {include_docs: true}, function (err, docs) {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }
            if(docs){
                docs.forEach(function(doc) {
                    var item = doc.data;
                    item.id = doc._id;
                    item._rev = doc._rev;
                    response.orders.push(item);
                });

                res.status(200).send(response);
            }else{
                res.status(200).send([]);
            }
        });
    }
};

/*
 * PUT
 */
exports.update = function(req, res){
    var id = req.param('id');

    var body = {
        id: req.body.order.id,
        data: req.body.order
    };

    db.save(id, body, function(err, dbRes) {
        if (err) {
            console.log('Could not update');
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(id + ' has been updated');
            var response = {
                order: null
            };

            response.order = req.body.order;
            response.order.id = id;

            res.status(200).send(response);
        }
    });
};

/*
 * DELETE
 */
exports.delete = function(req, res) {
    var id = req.param('id');

    db.remove(id, function(err, dbRes) {
        if (dbRes) {
            if (err) {
                console.log('There was a error: ');
                res.status(500).send(err);
            } else {
                console.log('Deleted object with id of: ' + id);
                res.status(200).send({});
            }
        } else {
            res.status(200);
        }
    });
};


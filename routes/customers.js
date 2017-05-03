var	cradle 		= require('cradle'),
    path        = require('path');

var db = new(cradle.Connection)('http://o.tcp.eu.ngrok.io', 14725).database('bikesystem');

/*
 * POST
 */
exports.save = function(req, res){
    var response = {
        customer: null
    };
    req.body.customer.type = "customer";
    db.save(req.body.customer, function (err, dbRes) {
        if(err){
            res.status(500).send(err)
        }else{
            response.customer = dbRes;
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
        customer: null
    };

    db.get(id, function(err, doc) {
        if (err) {
            res.status(500).send(err);
        } else {
            response.customer = doc.data;
            response.customer.id = doc._id;

            console.log('Retrieved ' + id + ' customer by ID');
            res.status(200).send(response);
        }
    });
};

/*
 * GET
 */
exports.getAll = function(req, res){
    var response = {
        customers: []
    };

    db.view('customers/customersById', {include_docs: true}, function (err, docs) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }
        if(docs){
            docs.forEach(function(doc) {
                var item = doc.data;
                item.id = doc._id;

                item.rev = doc._rev;
                response.customers.push(item);
            });

            res.status(200).send(response);
        }else{
            res.status(200).send([]);
        }
    });
};

/*
 * PUT
 */
exports.update = function(req, res){
    var id = req.param('id');

    db.get(id, function(err, doc) {
        if (err) {
            res.status(500).send(err);
        } else {
            req.body.customer.type = "customer";
            db.save(id, req.body.customer, function(err, dbRes) {
                if (err) {
                    console.log('Could not update');
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    console.log(id + ' has been updated');
                    var response = {
                        customer: null
                    };

                    response.customer = req.body.customer;
                    response.customer.id = id;

                    res.status(200).send(response);
                }
            });
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


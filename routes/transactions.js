var	cradle 		= require('cradle'),
    path        = require('path');

var db = new(cradle.Connection)({auth:{username:"admin", password:"9999567890"}}).database('bikesystem');


/*
 * POST
 */
exports.save = function(req, res){
    var response = {
        transaction: null
    };
    req.body.transaction.type = "transaction";
    db.save(req.body.transaction, function (err, dbRes) {
        if(err){
            res.status(500).send(err)
        }else{
            response.transaction = dbRes;
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
        transaction: null
    };

    db.get(id, function(err, doc) {
        if (err) {
            res.status(500).send(err);
        } else {
            response.transaction = doc.data;
            response.transaction.id = doc._id;

            console.log('Retrieved ' + id + ' transaction by ID');
            res.status(200).send(response);
        }
    });
};

/*
 * GET
 */
exports.getAll = function(req, res){
    var response = {
        transactions: []
    };

    if(req.query.transactionID != undefined){
        db.get(req.query.transactionID, function(err, doc) {
            if (err) {
                res.status(500).send(err);
            } else {

                var transaction = doc.data;
                transaction.id = doc._id;

                console.log('Retrieved ' + req.query.transactionID + ' transaction by ID');
                res.status(200).send(transaction);
            }
        });
    }else if(req.query.awaitingMaterials != undefined){
        db.view('transactions/transactionsByAwaitingMaterials', {include_docs: true}, function (err, docs) {
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
    }else{
        db.view('transactions/transactionsById', {include_docs: true}, function (err, docs) {
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
    }
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

            var body = {
                data : req.body.transaction
            };

            db.save(id, body, function(err, dbRes) {
                if (err) {
                    console.log('Could not update');
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    console.log(id + ' has been updated');
                    var response = {
                        transaction: null
                    };

                    response.transaction = req.body.transaction;
                    response.transaction.id = id;

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


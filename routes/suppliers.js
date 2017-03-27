var	cradle 		= require('cradle'),
    path        = require('path');

var db = new(cradle.Connection)().database('bikesystem');


/*
 * POST
 */
exports.save = function(req, res){
    var response = {
        supplier: null
    };
    req.body.supplier.type = "supplier";
    db.save(req.body.supplier, function (err, dbRes) {
        if(err){
            res.status(500).send(err)
        }else{
            response.supplier = dbRes;
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
        supplier: {}
    };

    db.view('suppliers/suppliersById', {key: id, include_docs: true}, function (err, docs) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }
        if(docs){
            docs.forEach(function(doc) {
                var item = doc;
                item.id = item._id;
                item.rev = item._rev;
                response.supplier = item;
            });

            res.status(200).send(response);
        }else{
            res.status(200).send([]);
        }
    });
};

/*
 * GET
 */
exports.getAll = function(req, res){
    var response = {
        suppliers: []
    };

    db.view('suppliers/suppliersById', {include_docs: true}, function (err, docs) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }
        if(docs){
            docs.forEach(function(doc) {
                var item = doc;
                item.id = item._id;
                item.rev = item._rev;
                response.suppliers.push(item);
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
            req.body.supplier.type = "supplier";
            db.save(id, req.body.supplier, function(err, dbRes) {
                if (err) {
                    console.log('Could not update');
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    console.log(id + ' has been updated');
                    var response = {
                        supplier: null
                    };

                    response.supplier = req.body.supplier;
                    response.supplier.id = id;

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


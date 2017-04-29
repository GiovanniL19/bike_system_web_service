var	cradle 		= require('cradle'),
    path        = require('path');

var db = new(cradle.Connection)({auth:{username:"admin", password:"9999567890"}}).database('bikesystem');

/*
 * POST
 */
exports.save = function(req, res){
    var response = {
        material: null
    };
    req.body.item.type = "material";
    db.save(req.body.item, function (err, dbRes) {
        if(err){
            res.status(500).send(err)
        }else{
            response.item = dbRes;
            res.status(201).send(response);
        }
    });
};

/*
 * GET
 */
exports.get = function(req, res){
    var id = req.param("id");

    db.get(id, function(err, doc) {
        if (err) {
            res.status(500).send(err);
        } else {
            var response = {
                id: id,
                type: doc.type,
                barcode: doc.barcode,
                name: doc.name,
                description: doc.description,
                warehouseQuantity: doc.warehouseQuantity,
                minQuantity: doc.minQuantity,
                reOrderQuantity: doc.reOrderQuantity,
                quotedQuantity: doc.quotedQuantity,
                reservedStock: doc.reservedStock,
                trade: doc.trade,
                retail: doc.retail,
                leadTime: doc.leadTime,
                group: doc.group,
                supplier: doc.supplier,
                bikes: doc.bikes
            };

            console.log('Retrieved ' + id + ' material by ID');
            res.status(200).send(response);
        }
    });
};

/*
 * GET
 */
exports.getAll = function(req, res){
    var response = {
        items: []
    };

    if(req.query.itemName != undefined){
        db.view('materials/materialsByName', {include_docs: true, key: req.query.itemName}, function (err, docs) {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }
            if(docs){

                docs.forEach(function(doc) {
                    var item = {
                        id: doc._id,
                        type: doc.type,
                        barcode: doc.barcode,
                        name: doc.name,
                        description: doc.description,
                        warehouseQuantity: doc.warehouseQuantity,
                        minQuantity: doc.minQuantity,
                        reOrderQuantity: doc.reOrderQuantity,
                        quotedQuantity: doc.quotedQuantity,
                        reservedStock: doc.reservedStock,
                        trade: doc.trade,
                        retail: doc.retail,
                        leadTime: doc.leadTime,
                        group: doc.group,
                        supplier: doc.supplier,
                        bikes: doc.bikes
                    };

                    response.items.push(item);
                });

                res.status(200).send(response);
            }else{
                res.status(200).send([]);
            }
        });
    }else{
        db.view('materials/materialsById', {include_docs: true}, function (err, docs) {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }
            if(docs){
                docs.forEach(function(doc) {
                    var item = {
                        id: doc._id,
                        type: doc.type,
                        barcode: doc.barcode,
                        name: doc.name,
                        description: doc.description,
                        warehouseQuantity: doc.warehouseQuantity,
                        minQuantity: doc.minQuantity,
                        reOrderQty: doc.reOrderQty,
                        quotedQuantity: doc.quotedQuantity,
                        reservedStock: doc.reservedStock,
                        trade: doc.trade,
                        retail: doc.retail,
                        leadTime: doc.leadTime,
                        group: doc.group,
                        supplier: doc.supplier,
                        bikes: doc.bikes
                    };

                    response.items.push(item);
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
            req.body.item.type = "material";
            db.save(id, req.body.item, function(err, dbRes) {
                if (err) {
                    console.log('Could not update');
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    console.log(id + ' has been updated');
                    var response = {
                        item: null
                    };

                    response.item = req.body.item;
                    response.item.id = id;

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


var	cradle 		= require('cradle'),
    path        = require('path');

var db = new(cradle.Connection)({auth:{username:"admin", password:"9999567890"}}).database('bikesystem');


/*
 * POST
 */
exports.save = function(req, res){
    var response = {
        manifest: null
    };
    req.body.manifest.type = "manifest";
    db.save(req.body.manifest, function (err, dbRes) {
        if(err){
            res.status(500).send(err)
        }else{
            response.manifest = dbRes;
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
        manifest: null
    };

    db.get(id, function(err, doc) {
        if (err) {
            res.status(500).send(err);
        } else {
            response.manifest = doc.data;
            response.manifest.id = doc._id;

            console.log('Retrieved ' + id + ' manifest by ID');
            res.status(200).send(response);
        }
    });
};

/*
 * GET
 */
exports.getAll = function(req, res){
    var response = {
        manifests: []
    };
    db.view('manifests/manifestsById', {include_docs: true}, function (err, docs) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }
        if(docs){
            docs.forEach(function(doc) {
                var item = doc.data;
                item.id = doc._id;

                item.rev = doc._rev;
                response.manifests.push(item);
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

            var body = {
                data : req.body.manifest
            };

            db.save(id, body, function(err, dbRes) {
                if (err) {
                    console.log('Could not update');
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    console.log(id + ' has been updated');
                    var response = {
                        manifest: null
                    };

                    response.manifest = req.body.manifest;
                    response.manifest.id = id;

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


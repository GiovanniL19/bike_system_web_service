var	cradle 		= require('cradle'),
    path        = require('path');

var db = new(cradle.Connection)().database('bikesystem');


/*
 * POST
 */
exports.save = function(req, res){
    var response = {
        group: null
    };
    req.body.group.type = "group";
    db.save(req.body.group, function (err, dbRes) {
        if(err){
            res.status(500).send(err)
        }else{
            response.group = dbRes;
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
        group: null
    }

    db.get(id, function(err, doc) {
        if (err) {
            res.status(500).send(err);
        } else {
            response.group = doc;
            response.group.id = doc._id;

            console.log('Retrieved ' + id + ' group by ID');
            res.status(200).send(response);
        }
    });
};

/*
 * GET
 */
exports.getAll = function(req, res){
    var response = {
        groups: []
    };

    db.view('groups/groupsById', {include_docs: true}, function (err, docs) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }
        if(docs){
            docs.forEach(function(doc) {
                var item = doc;
                item.id = item._id;
                item.rev = item._rev;
                response.groups.push(item);
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
            req.body.group.type = "group";
            db.save(id, req.body.group, function(err, dbRes) {
                if (err) {
                    console.log('Could not update');
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    console.log(id + ' has been updated');
                    var response = {
                        group: null
                    };

                    response.group = req.body.group;
                    response.group.id = id;

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


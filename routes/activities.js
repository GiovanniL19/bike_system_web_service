var	cradle 		= require('cradle'),
    path        = require('path');

var db = new(cradle.Connection)('http://o.tcp.eu.ngrok.io', 14725).database('bikesystem');

/*
 * POST
 */
exports.save = function(req, res){
    var response = {
        activity: null
    };
    req.body.activity.type = "activity";
    db.save(req.body.activity, function (err, dbRes) {
        if(err){
            res.status(500).send(err)
        }else{
            response.activity = dbRes;
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
        activity: null
    }

    db.get(id, function(err, doc) {
        if (err) {
            res.status(500).send(err);
        } else {
            response.activity = doc;
            response.activity.id = doc._id;

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
        activities: []
    };

    db.view('activities/activitiesById', {include_docs: true}, function (err, docs) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }
        if(docs){
            docs.forEach(function(doc) {
                var item = doc;
                item.id = item._id;
                item.rev = item._rev;
                response.activities.push(item);
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
            req.body.activity.type = "activity";
            db.save(id, req.body.activity, function(err, dbRes) {
                if (err) {
                    console.log('Could not update');
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    console.log(id + ' has been updated');
                    var response = {
                        activity: null
                    };

                    response.activity = req.body.activity;
                    response.activity.id = id;

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


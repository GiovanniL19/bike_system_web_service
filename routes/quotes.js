var	cradle 		= require('cradle'),
    path        = require('path');

var db = new(cradle.Connection)('http://o.tcp.eu.ngrok.io', 14725).database('bikesystem');

/*
 * POST
 */
exports.save = function(req, res){
    var response = {
        quote: null
    };
    req.body.quote.type = "quote";
    db.save(req.body.quote, function (err, dbRes) {
        if(err){
            res.status(500).send(err)
        }else{
            response.quote = dbRes;
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
        quote: null
    }

    db.get(id, function(err, doc) {
        if (err) {
            res.status(500).send(err);
        } else {
            response.quote = doc.data;
            response.quote.id = doc._id;

            console.log('Retrieved ' + id + ' quote by ID');
            res.status(200).send(response);
        }
    });
};

/*
 * GET
 */
exports.getAll = function(req, res){
    var response = {
        quotes: []
    };

    db.view('quotes/quotesById', {include_docs: true}, function (err, docs) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }
        if(docs){
            docs.forEach(function(doc) {
                var item = doc.data;
                item.id = doc._id;

                item.rev = doc._rev;
                response.quotes.push(item);
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
            req.body.quote.type = "quote";
            db.save(id, req.body.quote, function(err, dbRes) {
                if (err) {
                    console.log('Could not update');
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    console.log(id + ' has been updated');
                    var response = {
                        quote: null
                    };

                    response.quote = req.body.quote;
                    response.quote.id = id;

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


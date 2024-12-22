const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const sanitize = require('mongo-sanitize');

const ensureHttps = (url) => {
    return url.replace(/^http:\/\//i, 'https://');
};

// Get all records
recordRoutes.route("/episode").get(function (req, res) {
    const db_connect = dbo.getDb();
    db_connect
        .collection("episodes")
        .find({})
        .toArray()
        .then(result => {
            const secureEpisodes = result.map(episode => ({
                ...episode,
                uri: ensureHttps(episode.uri)
            }));
            res.json(secureEpisodes);
        })
        .catch(err => {
            console.error("Error:", err);
            res.status(500).send(err);
        });
});

// Get single record by id
recordRoutes.route("/episode/:id").get(function (req, res) {
    const db_connect = dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    db_connect
        .collection("episodes")
        .findOne(myquery)
        .then(result => {
            const secureEpisode = {
                ...result,
                uri: ensureHttps(result.uri)
            };
            res.json(secureEpisode);
            console.log("Single record sent:", secureEpisode);
        })
        .catch(err => {
            console.error("Error:", err);
            res.status(500).send(err);
        });
});

// Create new record
recordRoutes.route("/episode/add").post(function (req, response) {
    const db_connect = dbo.getDb();
    const cleanData = sanitize(req.body);
    const myobj = {
        title: cleanData.title,
        season: Number(cleanData.season),
        episode: Number(cleanData.episode),
        uri: ensureHttps(cleanData.uri)
    };
    db_connect
        .collection("episodes")
        .insertOne(myobj)
        .then(result => {
            response.json(result);
        })
        .catch(err => {
            response.status(500).send(err);
        });
});

// Update record
recordRoutes.route("/episode/update/:id").put(function (req, res) {
    const db_connect = dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const newvalues = {
        $set: {
            title: req.body.title,
            season: req.body.season,
            episode: req.body.episode,
            uri: ensureHttps(req.body.uri),
        },
    };
    db_connect
        .collection("episodes")
        .updateOne(myquery, newvalues)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

// Delete record
recordRoutes.route("/episode/:id").delete((req, response) => {
    const db_connect = dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    db_connect
        .collection("episodes")
        .deleteOne(myquery)
        .then(result => {
            console.log("1 document deleted");
            response.json(result);
        })
        .catch(err => {
            console.error("Error:", err);
            response.status(500).send(err);
        });
});

module.exports = recordRoutes;

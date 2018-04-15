'use strict';

const mongoose = require('mongoose');
const dbConnection = require('../config/constants.js');

const Schema = mongoose.Schema;

const eventSchema = mongoose.Schema({
    ownerID           : {type: String, required: true},
    title             : {type: String, required: true},
    usersLimit        : {type: Number, required: true},
    lng               : {type: Number, required: true},
    lat               : {type: Number, required: true},
    created_at        : {type: String, required: true},
    eventDateTime     : {type: String, required: true},
    interest          : {type: String, required: true},
    placeOfInterest   : String,
    appliedUserID     : [String],
    declinedUserID    : [String],
    acceptedUserID    : [String]
});

mongoose.Promise = global.Promise; 
mongoose.connect(dbConnection.dbConnection);
const db = mongoose.connection;

db.once('open', () => {console.log("Connection to the database established...");});

module.exports = mongoose.model('event', eventSchema);

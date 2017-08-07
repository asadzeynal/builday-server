'use strict';

const mongoose = require('mongoose');
const dbConnection = require('../config/constants.js');

const Schema = mongoose.Schema;

const eventSchema = mongoose.Schema({
    ownerEmail        : String,
    title             : {type: String, unique: true},
    usersLimit        : Number,
    lng               : Number,
    lat               : Number,
    created_at        : String,
    interest          : String,
    yourInfo          : String,
    joinedUsers       : [String]
});

mongoose.Promise = global.Promise; 
mongoose.connect(dbConnection.dbConnection);
const db = mongoose.connection;

db.once('open', () => {console.log("Connection to the database established...");});

module.exports = mongoose.model('event', eventSchema);

'use strict';

const mongoose = require('mongoose');
const dbConnection = require('../config/constants.js');

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    name              : String,
    surname           : String,
    email             : String,
    gender            : String,
    hashed_password   : String,
    created_at        : String,
    temp_password     : String,
    temp_password_time: String
});

mongoose.Promise = global.Promise; 
mongoose.connect(dbConnection.dbConnection);
const db = mongoose.connection;

db.once('open', () => {console.log("Connection to the database established...");});

module.exports = mongoose.model('user', userSchema);

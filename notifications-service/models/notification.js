'use strict';

const mongoose = require('mongoose');
const dbConnection = require('../config/constants.js');

const Schema = mongoose.Schema;

const userNotificationSchema = mongoose.Schema({
    title            : {type: String, required: true},
    body             : {type: String, required: false},
    type             : {type: Number, required: true},
    recieverID       : {type: String, required: true},
    eventID          : {type: String, required: false},
    secondUserID     : {type: String, required: false},
    statusCode       : {type: Number, required: true},
    dateTime         : {type: String, required: true},
});

mongoose.Promise = global.Promise; 
mongoose.connect(dbConnection.dbConnection);
const db = mongoose.connection;

db.once('open', () => {console.log("Connection to the database established...");});

module.exports = mongoose.model('userNotification', userNotificationSchema);

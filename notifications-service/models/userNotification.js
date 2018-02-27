'use strict';

const mongoose = require('mongoose');
const dbConnection = require('../config/constants.js');

const Schema = mongoose.Schema;

const userNotificationSchema = mongoose.Schema({
    userID            : {type: String, required: true},
    fcmToken          : {type: String, required: false},
    notifications     : [{ nType: String, message: String, date: Date }]
});

mongoose.Promise = global.Promise; 
mongoose.connect(dbConnection.dbConnection);
const db = mongoose.connection;

db.once('open', () => {console.log("Connection to the database established...");});

module.exports = mongoose.model('userNotification', userNotificationSchema);

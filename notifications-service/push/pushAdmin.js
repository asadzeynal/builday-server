'use strict'

var admin = require('firebase-admin');
const userNotification = require('../models/userNotification');

var serviceAccount = require('../config/single-bindery-175816-firebase-adminsdk-cs0uw-b105f1c3aa.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://single-bindery-175816.firebaseio.com"
});

exports.refreshFCMToken = (userEmail, token) =>
  new Promise((resolve,reject) => {
        userNotification.find({email:userEmail})

       .then((users) => {
            var u = users[0];
            u.fcmToken = token;
            return u.save();
       })
        .then(() => resolve({ status: 201, message: 'Token Refreshed Successfully' }))

       .catch(err => {
            reject({ status: 500, message: 'Internal Server Error !' });
       });
   });
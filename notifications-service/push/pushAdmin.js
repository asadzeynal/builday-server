'use strict'

const userNotification = require('../models/userNotification');

exports.refreshFCMToken = (userEmail, token) =>
  new Promise((resolve,reject) => {
        userNotification.find({email:userEmail})

       .then((users) => {
            var u = users[0];
              if(u===undefined){
                u = new userNotification({
                userID: userEmail,
              });
            }
            u.fcmToken = token;
            return u.save();
       })
        .then(() => resolve({ status: 201, message: 'Token Refreshed Successfully' }))

       .catch(err => {
            reject({ status: 500, message: 'Internal Server Error !' });
       });
   });
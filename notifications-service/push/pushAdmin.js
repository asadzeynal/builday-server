'use strict'

const userNotification = require('../models/userNotification');

exports.refreshFCMToken = (userEmail, token) =>
  new Promise((resolve,reject) => {
        userNotification.find({userID:userEmail})
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

   exports.sendNotification = (msg, userEmail) => {
     userNotification.find({userID:userEmail})
     .then((users) => {
       var u = users[0];
       msg.address = u.fcmToken;
     }).catch(err => {
      reject({ status: 500, message: 'Notification token not found!' });
    });
    var message = {
      android: {
      ttl: 3600 * 1000, // 1 hour in milliseconds
      priority: 'normal',
      notification: {
        title: msg.title,
        body: msg.body,
        icon: 'stock_ticker_update',
        color: '#f45342'
      }
    },
      token: msg.address
    };
    admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  
  }
  
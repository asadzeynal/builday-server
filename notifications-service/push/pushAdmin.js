'use strict'

const userNotification = require('../models/userNotification');
const notification = require('../models/notification');


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

exports.sendNotification = (msg, userEmail) => 
   new Promise((resolve, reject) => {
      userNotification.find({userID:userEmail})
        .then((users) => {
          var u = users[0];
          if(u === undefined){
            reject({status:400, message: 'User Notification account not found!'})
          }
          var n = new notification({
            title:msg.title,
            body: msg.body,
            type: msg.type,
            recieverID: userEmail,
            eventID: msg.eventID,
            secondUserID: msg.secondUserID,
            statusCode: -2,  // has not seen and reacted
            dateTime: new Date().toISOString()
          })
          nots = notification.find({title: n.title, body: n.body, recieverID:n.recieverID, 
            type: n.type, eventID: n.eventID, secondUserID:n.secondUserID});
            if(nots[0] === undefined){
              return;
            }

          n.save();
          msg.address=u.fcmToken;
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
        })
   })
})
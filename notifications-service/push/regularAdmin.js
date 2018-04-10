'use strict'

const userNotification = require('../models/notification');

exports.getLastXNotifications = (userID, num) =>
  new Promise((resolve,reject) => {
        userNotification.find({recieverID:userID})
       .then((notifications) => {
            var filtered;
            if(notifications.length >= num){
                filtered = notifications.slice(notifications.length - num, notifications.length + 1);
            } else {
                filtered = notifications;
            }
            resolve(filtered);
       })
        .then((array) => resolve(array))

       .catch(err => {
            reject({ status: 500, message: 'Internal Server Error !' });
       });
   });
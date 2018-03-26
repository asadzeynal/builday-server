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

exports.sendNotification = (message, userEmail) => {
  var message = {
    data: {
      score: '850',
      time: '2:45'
    },
    token: 'ck9f1bmpnqg:APA91bHzKZyMa_DIeDUjV_e96DLrPK_eUXO9t2ipTtI6NaDdHXSxivNK-rIAqumc39LTV1dRcavEEd6WfNFH0PYmQ3ZIgy-9NpVMrtOmGceIwIOBkFNl85gSuwFzQ7wBexN0mWuakJGp'
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
'use strict';

const event = require('../models/event');
const communication = require('../communication/userEventIdSend');

exports.createEvent = (title, ownerEmail, usersLimit, lat, lng, interest, dateTime) =>
  new Promise((resolve,reject) => {
    var dtArray = dateTime.split(" ");
    var hoursMinutes = dtArray[1].split(":")
    var hours = hoursMinutes[0];
    var mins = hoursMinutes[1];
    var ymdArray = dtArray[0].split("/");
    var year = ymdArray[2];
    var month = ymdArray[1];
    var day = ymdArray[0];
       const newEvent = new event({
           title: title,
           ownerID: ownerEmail,
           usersLimit: usersLimit,
           created_at: new Date().toISOString(),
           lat: lat,
           lng: lng,
           interest: interest,
           eventDateTime: new Date(year, month, day, hours, mins).toISOString()
       });
        newEvent.acceptedUserID.push(ownerEmail);
        newEvent.save();
        var ev = event.find({title: newEvent.title, ownerID: ownerEmail, created_at: newEvent.created_at});
        communication.addEventToCreator(ev._id, ownerEmail)
       
       .then((result) => resolve({ status: result.status, message: 'Event Created Sucessfully !' }))

       .catch(err => {

           if (err.code == 11000) {

               reject({ status: 409, message: 'Event Already Exists' });

           } else {

               reject({ status: 500, message: 'Internal Server Error !' });
           }
       });
   });
exports.addUserToEvent = (eventID, userID) =>
  new Promise((resolve,reject) => {

        event.find({_id:eventID})

       .then((events) => {
            let e = events[0];
            if(contains(e.appliedUserID, userID)){
                return;
            }
            e.appliedUserID.push(userID);
            var res = communication.sendEventUser(eventID, userID);
            var msg = {
                title: 'Somebody wants to join your event!',
                body: 'A user wants to join your event. Check his profile to see if you want to accept him.',
                type: 1, //when someone joins your event,
                eventID: eventID,
                secondUserID: userID
            }
            var send = communication.sendNotification(msg, e.ownerID);
            return e.save();
       })
        .then(() => resolve({ status: 201, message: 'You Joined Sucessfully !' }))

       .catch(err => {

           if (err.code == 11000) {

               reject({ status: 409, message: 'User Already Exists' });

           } else {

               reject({ status: 500, message: 'Internal Server Error !' });
           }
       });
   });
exports.deleteUserFromEvent = (eventID, userID) =>
  new Promise((resolve,reject) => {
        event.find({_id:eventID})

       .then((events) => {
            var e = events[0];
            var ind = e.joinedUsers.indexOf(userID);
            if(ind > -1){
                e.joinedUsers.splice(ind);
            }
            return e.save();
       })
        .then(() => resolve({ status: 201, message: 'You were removed successfully' }))

       .catch(err => {

           if (err.code == 11000) {

               reject({ status: 409, message: 'User Already Exists' });

           } else {

               reject({ status: 500, message: 'Internal Server Error !' });
           }
       });
   });
   function contains(arr, element) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === element) {
            return true;
        }
    }
    return false;
}
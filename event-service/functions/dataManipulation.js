'use strict';

const event = require('../models/event');

exports.createEvent = (title, ownerEmail, usersLimit, lat, lng, interest) =>
  new Promise((resolve,reject) => {

       const newEvent = new event({
           title: title,
           ownerEmail: ownerEmail,
           usersLimit: usersLimit,
           lat: lat,
           lng: lng,
           interest: interest,
           created_at: new Date()
       });
        newEvent.joinedUsers.push(ownerEmail);
        newEvent.save()
       
       .then(() => resolve({ status: 201, message: 'Event Created Sucessfully !' }))

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
            e.joinedUsers.push(userID);
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
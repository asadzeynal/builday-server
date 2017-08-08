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

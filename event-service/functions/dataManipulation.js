'use strict';

const event = require('../models/event');
const MongoClient = require('mongodb').MongoClient;
const eventsDBName = 'builday-events-db';
const communication = require('../communication/userEventIdSend');
const config = require('../config/constants')
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
        newEvent.save()
            .then((res) => {
                MongoClient.connect(config.dbConnection)
                    .then(client => {
                        const events = client.db(eventsDBName).collection('events-stack');
                        events.insert({'_id':res._id, 'interest': res.interest})
                        client.close()
                    })
                return res;
            })
        .then((res) => { 
            communication.addEventToCreator(res._id, ownerEmail)
        })
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

   exports.acceptUserToEvent = (userID, eventID) =>
   new Promise((resolve, reject) => {
        event.find({_id:eventID})
        .then((events) => {
            var e = events[0];
            if (contains(e.appliedUserID, userID)){
                e.acceptedUserID.push(userID);
                return e.save();
            }
        })
        .then((e) => {
            var ind = e.appliedUserID.indexOf(userID);
            if(ind > -1){
                e.appliedUserID.splice(ind);
            }
            e.save();
        })
        .then(() => {
            communication.acceptUserToEvent(userID, eventID);
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

exports.declineUserToEvent = (userID, eventID) =>
   new Promise((resolve, reject) => {
        event.find({_id:eventID})
        .then((events) => {
            var e = events[0];
            if (contains(e.appliedUserID, userID)){
                e.declinedUserID.push(userID);
                return e.save();
            }
        })
        .then((e) => {
            var ind = e.appliedUserID.indexOf(userID);
            if(ind > -1){
                e.appliedUserID.splice(ind);
            }
            e.save();
        })
        .then(() => {
            communication.declineUserToEvent(userID, eventID);
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
'use strict';

const user = require('../models/user');

exports.getProfile = email =>

  new Promise((resolve,reject) => {

      user.find({ email: email }, { name: 1, surname: 1, gender: 1, mainPhoto:1, workPlace:1, yourInfo:1, yourInterests:1, email: 1, created_at: 1, _id: 0 })

      .then(users => resolve(users[0]))

      .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

  });

    exports.getOtherUserProfile = email =>

    new Promise((resolve, reject) => {

        user.find({email: email }, {name:1, surname:1})

        .then(users => resolve(users[0]))
        
        .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
    });

  exports.updateProfile = (body, email) => new Promise((resolve, reject) => {

        user.find({ email: email })

        .then(users => {

            let user = users[0];
            if(body.mainPhoto){
                user.mainPhoto = body.mainPhoto;
            }   
                user.workPlace = body.workPlace;
                user.yourInfo = body.yourInfo;
                user.yourInterests = body.yourInterests;
            // }
            return user.save();
            
        })

        .then(user => resolve({ status: 200, message: 'Profile Updated Sucessfully !' }))

        .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });

    exports.addStatus = (email, status) => new Promise((resolve, reject) => {
        user.find({ email: email })
        .then(users => {
            let user = users[0];
            user.statuses.push(status);
            return user.save();
        })
        .then(user => resolve({ status : 200, message: 'Status Uploaded Successfully!'}))
        .catch(err => reject({ status: 500, message: 'Internal Server Error!'}))
    });
    exports.getEventFromUser = (email, num) => new Promise((resolve, reject) => {
        user.find({email: email})
        .then(users =>{
            let u = users[0];
            let event = u.appliedEvents[num];
            return event;
        })
        .then(event => {
            resolve(event);
        })
        .catch(err => reject({ status: 404, message: 'Event not found !' }));
    });
    exports.getEventAmount = (email) => new Promise((resolve, reject)=>{
        user.aggregate([{$match: {email: email}}, {$project: {appliedEvents: {$size: '$appliedEvents'}}}])
        .then(num => {
            resolve(num[0].appliedEvents);
        })
        .catch(err => reject({ status: 404, message: 'ERROR!' }))
    });

    exports.addEventToUser = (userID, eventID) =>
        
        new Promise((resolve,reject) => {
            
                    user.find({email:userID})
            
                   .then((users) => {
                        let u = users[0];
                        u.appliedEvents.push(eventID);
                        return u.save();
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
    
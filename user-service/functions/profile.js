'use strict';

const user = require('../models/user');

exports.getProfile = email =>

  new Promise((resolve,reject) => {

      user.find({ email: email }, { name: 1, surname: 1, gender: 1, mainPhoto:1, workPlace:1, yourInfo:1, yourInterests:1, email: 1, created_at: 1, _id: 0 })

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
    exports.getStatus = (email, num) => new Promise((resolve, reject) => {
        user.find({email: email})
        .then(users =>{
            let user = users[0];
            let text = user.statuses[num];
            return text;
        })
        .then(text => {
            resolve(text);
        })
        .catch(err => reject({ status: 404, message: 'Status not found !' }));
    });
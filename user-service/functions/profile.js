'use strict';

const user = require('../models/user');

exports.getProfile = email =>

  new Promise((resolve,reject) => {

      user.find({ email: email }, { name: 1, surname: 1, gender: 1, mainPhoto:1, email: 1, created_at: 1, _id: 0 })

      .then(users => resolve(users[0]))

      .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

  });

  exports.updateProfile = (photo, email) => new Promise((resolve, reject) => {

        user.find({ email: email })

        .then(users => {

            let user = users[0];
            user.mainPhoto = photo;
            return user.save();
            
        })

        .then(user => resolve({ status: 200, message: 'Profile Updated Sucessfully !' }))

        .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

    });
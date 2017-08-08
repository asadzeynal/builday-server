'use strict';

const event = require('../models/event');

exports.returnAllEvents = () =>
  new Promise((resolve,reject) => {
       event.find()
       .then(events => resolve(events))
       .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
   });
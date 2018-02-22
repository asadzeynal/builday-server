'use strict';

const event = require('../models/event');

exports.returnAllEvents = () =>
  new Promise((resolve,reject) => {
       event.find({"eventDateTime": {"$gte": new Date().toISOString()}})
       .then(events => resolve(events))
       .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
   });

exports.getEvent = id =>
   new Promise((resolve, reject) => {
     event.find({_id:id})
     .then(events => resolve(events[0]))
     .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
   });
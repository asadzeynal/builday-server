'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const create = require('../functions/dataManipulation.js');
const returner = require('../functions/dataAccess.js')
const h = require('./helpers');

module.exports = ()=>{
    let routes = {
        'get':{
            '/events':(req, res) =>{
            returner.returnAllEvents()

            .then(result => res.json(result))

            .catch(err => res.status(err.status).json({ message: err.message }));
   
            },
            '/events/:id': (req, res) => {
                returner.getEvent(req.params.id)
                .then(result => res.json(result))
                .catch(err => res.status(err.status).json({ message: err.message }));
            }
        },
        'post':{
            '/events/upload/:id': (req, res, next) => {
                const title = req.body.title;
                const ownerEmail = req.body.ownerID;
                const usersLimit = req.body.usersLimit;
                const lat = req.body.lat;
                const lng = req.body.lng;
                const interest = req.body.interest;
                const dateTime = req.body.eventDateTime;
                if (!dateTime || !title || !ownerEmail || !usersLimit || !lat || !lng || !interest|| !title.trim() || !ownerEmail.trim() || !interest.trim()) {
                res.status(400).json({message: 'Invalid Request !'});
                } else {

                create.createEvent(title, ownerEmail, usersLimit, lat, lng, interest, dateTime)

                .then(result => { res.status(result.status).json({ message: result.message })
                })

                .catch(err => res.status(err.status).json({ message: err.message }));
                }               
            },
            '/events/:eid/:uid': (req, res, next) => {
                const userID = req.params.uid;
                const eventID = req.params.eid;
                if(!userID.trim() || !eventID.trim()){
                   res.status(400).json({message: 'Invalid Request !'});
                } else {
                    create.addUserToEvent(eventID, userID)
                    .then(result => { res.status(result.status).json({ message: result.message })})
                    .catch(err => res.status(err.status).json({ message: err.message }));
                }
            },
            'event/acceptUser/:uid/:eid': (req, res, next) => {
                const userID = req.params.uid;
                const eventID = req.params.eid;
                create.acceptUserToEvent(userID, eventID)
                .then(result => { res.status(result.status).json({ message: result.message })})
                .catch(err => res.status(err.status).json({ message: err.message }));
            },
            'event/declineUser/:uid/:eid': (req, res, next) => {
                const userID = req.params.uid;
                const eventID = req.params.eid;
                create.declineUserToEvent(userID, eventID)
                .then(result => { res.status(result.status).json({ message: result.message })})
                .catch(err => res.status(err.status).json({ message: err.message }));
            }
        },
        'put':{    
          '/events/:eid/:uid': (req, res, next) => {
                const userID = req.params.uid;
                const eventID = req.params.eid;
                if(!userID.trim() || !eventID.trim()){
                   res.status(400).json({message: 'Invalid Request !'});
                } else {
                    create.deleteUserFromEvent(eventID, userID)
                    .then(result => { res.status(result.status).json({ message: result.message })})
                    .catch(err => res.status(err.status).json({ message: err.message }));
                }
            }
        }    
    }
    return h.route(routes);
}

'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const create = require('../functions/create.js');
const returner = require('../functions/returner.js')
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
                const ownerEmail = req.body.ownerEmail;
                const usersLimit = req.body.usersLimit;
                const lat = req.body.lat;
                const lng = req.body.lng;
                const interest = req.body.interest;
                if (!title || !ownerEmail || !usersLimit || !lat || !lng || !interest|| !title.trim() || !ownerEmail.trim() || !interest.trim()) {
                res.status(400).json({message: 'Invalid Request !'});
                } else {

                create.createEvent(title, ownerEmail, usersLimit, lat, lng, interest)

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

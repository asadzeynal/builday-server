'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const pushAdmin = require('../push/pushAdmin.js');
const regularAdmin = require('../push/regularAdmin.js');
const h = require('./helpers');

module.exports = ()=>{
    let routes = {
        'get': {
            '/notifications/:id/last/:num': (req, res, next) => {
                regularAdmin.getLastXNotifications(req.params.id, req.params.num)
                .then(result => res.json(result))
                .catch(err => res.status(err.status).json({ message: err.message }));
            }
        },
        'put': {
            '/notifications/token/update': (req, res, next) => {
                const email = req.body.email;
                const fcmToken = req.body.fcmToken;
                pushAdmin.refreshFCMToken(email, fcmToken)
                .then(result => res.json(result))
                .catch(err => res.status(err.status).json({ message: err.message }));
            }
        },
        'post':{
            '/notifications/post': (req, res, next) => {
                const msg = req.body.msg;
                const userID = req.body.userID;
                pushAdmin.sendNotification(msg, userID)
                    .then(result => res.json(result))
                    .catch(err=> res.status(err.status).json({message: err.message}));
            }
        }
    }
    return h.route(routes);
}

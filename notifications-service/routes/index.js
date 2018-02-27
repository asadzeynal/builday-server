'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const pushAdmin = require('../push/pushAdmin.js');
const h = require('./helpers');

module.exports = ()=>{
    let routes = {
        'put':{
            '/notifications/token/update': (req, res, next) => {
                const email = req.body.email;
                const fcmToken = req.body.fcmToken;
                pushAdmin.refreshFCMToken(email, fcmToken);
            }
        }
    }
    return h.route(routes);
}

'use strict';
const request = require('request');
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const h = require('../helpers');
module.exports = () =>{
    let routes = {
        'get' : {
            '/' : (req,res,next)=>{
                req.pipe(request(config.users)).pipe(res);
            },
            '/users/:id':(req,res,next)=>{
                if(checkToken(req)){
                    req.pipe(request(config.users +'/users/'+req.params.id)).pipe(res);
                }else{
                    res.status(401).json({message : 'Invalid Token !'});
                }
            },
            '/users/user/:id':(req,res,next)=>{
                req.pipe(request(config.users + '/users/user/'+req.params.id)).pipe(res);
            },
            '/users/:id/event/:num': (req, res, next) => {
                req.pipe(request(config.users + '/users/' + req.params.id + '/event/' + req.params.num)).pipe(res);
            },
            '/users/:id/event/amount' : (req, res, next)=>{
                req.pipe(request(config.users + '/users/' + req.params.id + '/event/amount' )).pipe(res);
            },
            '/events': (req, res, next) => {
                req.pipe(request(config.events + '/events')).pipe(res);
            },
            '/events/:id': (req, res, next) => {
                req.pipe(request(config.events + '/events/' + req.params.id)).pipe(res);
            }, 
            '/notifications/:id/last/:num' : (req, res, next) => {
                if(checkToken(req)){
                    req.pipe(request(config.notifications + '/notifications/' + req.params.id + '/last/' + req.params.num)).pipe(res);
                }else{
                    res.status(401).json({message : 'Invalid Token !'});
                }
            }
        },
        'post':{
            '/authenticate': (req,res,next)=>{
                req.pipe(request(config.users + '/authenticate')).pipe(res);
            },
            '/tokenauth/:id': (req, res, next) => {
                if(checkToken(req)){
                    var token = req.headers['x-access-token'];
                    res.status(200).json({token: token});
                } else{
                    res.status(401).json({message: 'Invalid Token'});
                }
            },
            '/users' : (req,res,next)=>{
                req.pipe(request(config.users+'/users')).pipe(res);    
            },
            '/users/:id/password' :(req,res,next)=>{
                if(checkToken(req)){
                    req.pipe(request(config.users + '/users/' + req.params.id + '/password')).pipe(res);
                }
                else{
                    res.status(401).json({message:'Invalid Token !'});
                }
            },
            '/users/:id/status' :(req, res, next) => {
                if(checkToken(req)){
                    req.pipe(request(config.users + '/users/' + req.params.id + '/status')).pipe(res);
                }
                else{
                    res.status(401).json({message:'Invalid Token !'});
                }
            },
            '/events/upload/:id': (req, res, next) => {
                if(checkToken(req)){
                    req.pipe(request(config.events + '/events/upload/' + req.params.id)).pipe(res);
                }
                else{
                    res.status(401).json({message:'Invalid Token !'});
                }
            },
            '/events/:eid/:id': (req, res, next) => {
                if(checkToken(req)){
                    req.pipe(request(config.events + '/events/' + req.params.eid + '/' + req.params.id)).pipe(res);
                }
                else{
                    res.status(401).json({message:'Invalid Token !'});
                }
            }
        },
        'put':{
            '/users/:id' : (req,res,next)=>{
                if(checkToken(req)){
                    req.pipe(request(config.users+'/users/'+req.params.id)).pipe(res);
                }
                else{
                    res.status(401).json({message:'Invalid Token !'});
                }    
            },
            '/events/:eid/:id' : (req,res,next) => {
                if(checkToken(req)){
                    req.pipe(request(config.events + '/events/' + req.params.eid + '/' + req.params.id)).pipe(res);
                }
                else{
                    res.status(401).json({message:'Invalid Token !'});
                }
            },
            '/notifications/token/update' : (req, res, next) => {
                req.pipe(request(config.notifications + '/notifications/token/update')).pipe(res);
            }
        }
}   
return h.route(routes);    
}
function checkToken(req) {
    const token = req.headers['x-access-token'];
    if (token) {
        try {
            var decoded = jwt.verify(token, config.secret);
            return decoded.message === req.params.id;
            } 
        catch(err) {  
            return false;
        }
    } 
    else {
            return false;
        }
}
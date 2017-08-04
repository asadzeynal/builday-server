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
            '/users/:id/status/:num': (req, res, next) => {
                req.pipe(request(config.users + '/users/' + req.params.id + '/status/' + req.params.num)).pipe(res);
            },
            '/users/:id/status/size' : (req, res, next)=>{
                req.pipe(request(config.users + '/users/' + req.params.id + '/size' )).pipe(res);
            }
        },
        'post':{
            '/authenticate': (req,res,next)=>{
                req.pipe(request(config.users + '/authenticate')).pipe(res);
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
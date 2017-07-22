'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const register = require('../functions/register'); 
const login = require('../functions/login');
const profile = require('../functions/profile');
const password = require('../functions/password');
const config = require('../config/config.json');
const h = require('../helpers');

module.exports = ()=>{
    let routes = {
        'get':{
            '/':(req, res, next) =>{
                res.end('Welcome to BuilDay !')
            },
            '/users/:id':(req, res) =>{
            profile.getProfile(req.params.id)

            .then(result => res.json(result))

            .catch(err => res.status(err.status).json({ message: err.message }));
   
            }

        },
        'post':{
            '/authenticate' : (req, res, next)=>{
                const credentials = auth(req);

                if (!credentials) {

                   res.status(400).json({ message: 'Invalid Request !' });

                }else {
                    login.loginUser(credentials.name, credentials.pass)

                    .then(result => {

                    const token = jwt.sign(result, config.secret, { expiresIn: 1440 });

                    res.status(result.status).json({ message: result.message, token: token });

                })
                .catch(err => res.status(err.status).json({ message: err.message }));
                }    

            },
            '/users':(req, res, next)=>{
                const name = req.body.name;
                const email = req.body.email;
                const password = req.body.password;
                const surname = req.body.surname;
                const gender = req.body.gender;
                if (!name || !email || !password || !surname || !name.trim() || !email.trim() || !password.trim() || !surname.trim) {

                res.status(400).json({message: 'Invalid Request !'});

               } else {

                register.registerUser(name, surname, email, password, gender)

                .then(result => {

                res.setHeader('Location', '/users/'+email);
                res.status(result.status).json({ message: result.message })
                })

                .catch(err => res.status(err.status).json({ message: err.message }));
                }    
            },
            '/users/:id/password':(req,res,user)=>{
                const email = req.params.id;
                const token = req.body.token;
                const newPassword = req.body.password;

                if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

                password.resetPasswordInit(email)

                .then(result => res.status(result.status).json({ message: result.message }))

                .catch(err => res.status(err.status).json({ message: err.message }));

                } else {

                password.resetPasswordFinish(email, token, newPassword)

                .then(result => res.status(result.status).json({ message: result.message }))

                .catch(err => res.status(err.status).json({ message: err.message }));
                }
            }           
        },
        'put':{
            '/users/:id':(req,res,next)=>{
                // if (checkToken(req)) {
            
                if(!req.body.newPassword){
                    const email = req.params.id;
                    profile.updateProfile(req.body, email)
                    .then(result => res.status(result.status).json({ message: result.message }))
                    .then(err => res.status(err.status).json({ message: err.message }));
                

                } else {
                const oldPassword = req.body.password;
                const newPassword = req.body.newPassword;

                if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

                res.status(400).json({ message: 'Invalid Request !' });

                } else {

                    password.changePassword(req.params.id, oldPassword, newPassword)

                    .then(result => res.status(result.status).json({ message: result.message }))

                    .catch(err => res.status(err.status).json({ message: err.message }));

                }
                }   
                 

            }
        }
    }
    return h.route(routes);
}

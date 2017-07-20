const request = require('request');
const config  = require('./config/config.json');
const jwt = require('jsonwebtoken');

module.exports = router => {
    router.get('/', (req, res) => {
        req.pipe(request(config.users)).pipe(res);
    });

    router.post('/authenticate', (req, res) => {
        req.pipe(request(config.users + '/authenticate')).pipe(res);
    });

    router.post('/users', (req, res) => {
        req.pipe(request(config.users + '/users')).pipe(res);
    });

    router.get('/users/:id', (req,res) => {
        if (checkToken(req)) {
            req.pipe(request(config.users + '/users/' + req.params.id)).pipe(res);
        }else {
            res.status(401).json({ message: 'Invalid Token !' });
        }
    });

    router.put('/users/:id', (req,res) => {
        if (checkToken(req)) {
            req.pipe(request(config.users + '/users/' + req.params.id)).pipe(res);
        }else {
            res.status(401).json({ message: 'Invalid Token !' });
        }
    });

    router.post('/users/:id/password', (req,res) => {
        req.pipe(request(config.users + '/users/' + req.params.id + '/password')).pipe(res);
    });
}

function checkToken(req) {

        const token = req.headers['x-access-token'];

        if (token) {

            try {

                  var decoded = jwt.verify(token, config.secret);

                  return decoded.message === req.params.id;

            } catch(err) {

                return false;
            }

        } else {

            return false;
        }
    }
const request = require('request');
const config  = require('./config/config.json');

module.exports = router => {
    router.get('/', (req, res) => {
        req.pipe(request(config.users)).pipe(res);
    });

    router.post('/authenticate', (req, res) => {
        req.pipe(request(config.users)).pipe(res);
    });

     router.post('/users', (req, res) => {
        req.pipe(request(config.users)).pipe(res);
    });

    router.get('/users/:id', (req,res) => {
        req.pipe(request(config.users)).pipe(res);
    });

    router.put('/users/:id', (req,res) => {
        req.pipe(request(config.users)).pipe(res);
    });

    router.post('/users/:id/password', (req,res) => {
        req.pipe(request(config.users)).pipe(res);
    });
}
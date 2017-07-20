'use strict'

const logger = require('morgan');
const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT || 8080;

app.use(logger('dev'));


require('./routes')(router);
app.use('/api/v1', router);

app.listen(port, () => {
    console.log(`BuilDay API Gateway started listening on port ${port}...`);
});

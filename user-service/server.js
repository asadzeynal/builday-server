'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const logger        = require('morgan');
const router        = express.Router();
const port        = process.env.PORT || 4000;
const rpc = require('./communication/userEventIdReceiver');

app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/api/v1', require('./routes')());
// var rpc = new rpc();
rpc.receiveEventIdUser();


app.listen(port, () => {
    console.log(`BuilDay user service started listening on port ${port}...`);
});

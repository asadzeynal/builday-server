'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const logger        = require('morgan');
const router        = express.Router();
const port        = process.env.PORT || 4004;

global.admin = require('firebase-admin');
var serviceAccount = require('./config/single-bindery-175816-firebase-adminsdk-cs0uw-b105f1c3aa.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://single-bindery-175816.firebaseio.com"
  });

app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/api/v1', require('./routes')());

app.listen(port, () => {
    console.log(`BuilDay notification service started listening on port ${port}...`);
});

'use strict';
var amqp = require('amqplib/callback_api');
 
amqp.connect('amqp://localhost', (err, conn) =>{
    conn.createChannel((err, ch) =>{
    })
});


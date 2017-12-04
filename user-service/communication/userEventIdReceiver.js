'use strict';

var amqp = require('amqplib/callback_api');
var prof = require('../functions/profile')

exports.receiveEventIdUser = () => {
    amqp.connect('amqp://localhost', function(err,conn){
    conn.createChannel(function(err,ch){
        var q = 'eventUserID';
        ch.assertQueue(q,{durable:false});
        ch.prefetch(1);        
        console.log('[x] Waiting for messages in %s',q);
        ch.consume(q, function reply(msg){
            console.log("[x] Received %s", msg.content.toString());
            var message = msg.content.toString().split(" ");
            var eventID = message[0];
            var userID  = message[1];
            // return msg.content.toString();
            prof.addEventToUser(userID, eventID)
                .then(result => {
                    ch.sendToQueue(msg.properties.replyTo,
                        new Buffer(result.status.toString()),
                        {correlationId: msg.properties.correlationId});
                
                      ch.ack(msg);
                }).catch(err => {
                    console.log(err);
                });
        });

    });

    });

}


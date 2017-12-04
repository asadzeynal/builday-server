'use strict';

var amqp = require('amqplib/callback_api');

exports.receiveEventIdUser = () => {
    amqp.connect('amqplib://localhost', function(err,conn){
    conn.createChannel(function(err,ch){
        var q = 'eventUserId';
        ch.assertQueue(q,{durable:true});

        console.log('[x] Waiting for messages in %s',q);
        ch.consume(q, function(msg){
            console.log("[x] Received %s", msg.content.toString());
            return msg.content.toString();
        });

    });

    });

}


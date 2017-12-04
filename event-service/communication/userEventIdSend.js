'use strict';

var amqp = require('amqplib/callback_api');


exports.sendEventUser = (eventID,userId) =>{
    amqp.connect('amqp://localhost', function(err,conn){
        conn.createChannel(function(err,ch){
            var q = 'eventUserID';

            ch.assertQueue(q,{durable:true});
            ch.sendToQueue(q,new Buffer(eventID + " " + userId));
        
            console.log("Sent eventId : " +eventId);
            console.log("Sent userId : " + userID);
        });    
    });
}



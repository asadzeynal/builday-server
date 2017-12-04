'use strict';

var amqp = require('amqplib/callback_api');


exports.sendEventUser = (eventID,userID) =>{
    amqp.connect('amqp://localhost', function(err,conn){
        conn.createChannel(function(err,ch){
            // var q = 'eventUserId';

            ch.assertQueue('',{exclusive:true}, (err, q)=>{
                var corr = generateUuid();
                ch.consume(q.queue, function(msg) {
                    if (msg.properties.correlationId == corr) {
                      console.log(' [.] Got %s', msg.content.toString());
                      return msg.content.toString();                                            
                      setTimeout(function() { conn.close(); process.exit(0) }, 500);
                    }
                  }, {noAck: true});
                            
                  ch.sendToQueue('eventUserID',new Buffer(eventID + " " + userID),  { correlationId: corr, replyTo: q.queue });
            });
           
        
            console.log("Sent eventId : " +eventID);
            console.log("Sent userId : " + userID);
        });    
    });
}

function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }



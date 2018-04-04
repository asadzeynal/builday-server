'use strict';

var amqp = require('amqplib/callback_api');
var request = require('request');


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

exports.sendNotification = (message, id) => {
    // request.post({url: 'http://localhost:4004/api/v1/notifications/post', form: {msg:msg, userID:userID}}, function(err, httpResponse, body){
    //     if(err) return 0;
    //     else return 1;
    // });

    request({
        url: 'http://localhost:4004/api/v1/notifications/post',
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        method: 'post',
        timeout: 60 * 1000,
        body: JSON.stringify({msg:message, userID:id})
    }, function (error, result, body) {
        if (error) {
            console.log(error);
            return 0;
        } else if (result.statusCode === 500) {
            console.log('error');
            return 0;
        } else {
            console.log(body);
            return 1;
        }
    });

    }


function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }



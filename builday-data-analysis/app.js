'use strict';
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const request = require('request-promise-native');
var url = 'mongodb://dosweedos:dosweedos@testcluster-shard-00-00-5tvah.mongodb.net:27017,testcluster-' +
    'shard-00-01-5tvah.mongodb.net:27017,testcluster-shard-00-02-5tvah.mongodb.net:27017/builday-events-db' +
    '?ssl=true&replicaSet=TestCluster-shard-0&authSource=admin';
const eventsDBName = 'builday-events-db';

MongoClient.connect(url)
    .then(client => {
        console.log(new Date().toISOString() + " *** Connected to BuilDay Mongo database!");
        const events = client.db(eventsDBName).collection('events-stack');
        let evnts = events.find();
        evnts.toArray()
            .then((arr) => {
                for (let doc of arr) {
                    let file = fs.readFileSync('./files/' + doc.interest.toLowerCase(), 'utf8');
                    file.toString().split("\n").forEach(function (line, index, arr) {
                        if (index === arr.length - 1 && line === "") {
                            return;
                        }
                        if (!(line === doc.ownerID)) {
                            console.log(line)
                            let msg = {
                                title: 'A newly created event matches your interest!',
                                body: doc.ownerID + ' has created an event called ' + doc.title + ' with interest ' + doc.interest,
                                type: 10, //when somebody created an interesting event,
                                eventID: doc._id,
                                secondUserID: doc.ownerID
                            }
                            sendNotificationAboutNewEvent(msg, line);
                        }
                    })
                }
            })
            .then(() => {
                return events.deleteMany({});
            })
            .then((res) => {process.exit()})

    })
    .catch(err => {
        console.log(err)
    });


function sendNotificationAboutNewEvent(msg,userID) {
    request({
        url: 'http://ec2-54-159-52-63.compute-1.amazonaws.com:4004/api/v1/notifications/post',
        headers: {'content-type' : 'application/json'},
        method: 'post',
        agent: false,
        pool: {maxSockets: 100},
        timeout: 60 * 1000,
        body: JSON.stringify({msg:msg, userID:userID})
    })
        .then((response) => resolve({ status: 201, message: 'User Accepted Sucessfully !' }))

        .catch((err) => {
            console.log(err);
            reject({ status: 500, message: 'Internal Server Error !' })
        })
}


// , function (error, result, body) {
//     if (error) {
//         console.log(error);
//     } else if (result.statusCode === 500) {
//         console.log('error');
//     } else {
//         console.log(body);
//     }
// }

'use strict';
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const request = require('request');
var url = 'mongodb://dosweedos:dosweedos@testcluster-shard-00-00-5tvah.mongodb.net:27017,testcluster-' +
    'shard-00-01-5tvah.mongodb.net:27017,testcluster-shard-00-02-5tvah.mongodb.net:27017/builday-events-db' +
    '?ssl=true&replicaSet=TestCluster-shard-0&authSource=admin';
const eventsDBName = 'builday-events-db';

function start() {
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
                                console.log(new Date().toISOString() + ' *** preparing to send notification to ' + line);
                                let msg = {
                                    title: 'A newly created event matches your interest!',
                                    body: doc.ownerID + ' has created an event called ' + doc.title + ' with interest ' + doc.interest,
                                    type: 10, //when somebody created an interesting event,
                                    eventID: doc._id,
                                    secondUserID: doc.ownerID
                                };
                                var ops = {
                                    url: 'http://ec2-54-159-52-63.compute-1.amazonaws.com:4004/api/v1/notifications/post',
                                    headers: {'content-type': 'application/json'},
                                    method: 'post',
                                    agent: false,
                                    pool: {maxSockets: 100},
                                    timeout: 60 * 1000,
                                    body: JSON.stringify({msg: msg, userID: line})
                                };
                                // sendNotificationAboutNewEvent(msg, line)
                                //     .then((res) => {console.log(new Date().toISOString() + ' *** notification sent to ' + line);})
                                //     .catch((err) => {console.log('ERROR')})
                                request(ops, function (error, response, body) {
                                    if (error) console.log(error);
                                    else console.log(new Date().toISOString() + ' *** notification sent to ' + line);
                                });
                            }
                        })
                    }
                })
                .then(() => {
                    return events.deleteMany({}, () => {
                        // process.exit(0);
                    });
                })
        })
        .catch(err => {
            console.log(err);
            return events.deleteMany({}, () => {
                // process.exit(0);
            });
        });
}

setInterval(start, 5000);

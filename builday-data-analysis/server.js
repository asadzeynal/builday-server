'use strict';
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const url = 'mongodb://dosweedos:dosweedos@testcluster-shard-00-00-5tvah.mongodb.net:27017,testcluster-' +
    'shard-00-01-5tvah.mongodb.net:27017,testcluster-shard-00-02-5tvah.mongodb.net:27017/builday-events-db' +
    '?ssl=true&replicaSet=TestCluster-shard-0&authSource=admin';
const eventsDBName = 'builday-events-db';


function readWriteFile() {
    new Promise((resolve, reject) => {
    MongoClient.connect(url)
        .then(client => {
            console.log(new Date().toISOString() + " *** Connected to BuilDay Mongo database!");
            const events = client.db(eventsDBName).collection('events');
            let evnts = events.find();
            evnts.toArray()
                .then((evs) => {
                    for (let event of evs) {
                        fs.open('./files/' + event.interest.toLowerCase(), 'w', (err, fd) => {
                            for (let email of event.appliedUserID) {
                                let data = fs.readFileSync('./files/' + event.interest.toLowerCase(), 'utf8');
                                if (data.indexOf(email) === -1) {
                                    fs.writeSync(fd, new Buffer(email + '\n'), (err) => {
                                        if (err) console.log(err)
                                    })
                                }
                            }
                            for (let email of event.acceptedUserID) {
                                let data = fs.readFileSync('./files/' + event.interest.toLowerCase(), 'utf8');
                                if (data.indexOf(email) === -1) {
                                    fs.writeSync(fd, new Buffer(email + '\n'), (err) => {
                                        if (err) console.log(err)
                                    })
                                }
                            }
                        })
                    }
                })
                .then((fd) => {
                    client.close();
                    setTimeout(function() {
                        readWriteFile();
                    }, 2000);
                })
                .catch((err) => {
                    console.log(err);
                })
        });
    })
}

// setTimeout(readWriteFile, 3000);

readWriteFile();


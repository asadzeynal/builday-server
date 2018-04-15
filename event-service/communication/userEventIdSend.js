'use strict';

var amqp = require('amqplib/callback_api');
var request = require('request');
var requestPromise = require('request-promise-native');


exports.sendEventUser = (eventID,userID) =>{
    request({
        url: 'http://localhost:4000/api/v1/users/event/add',
        headers: {'content-type' : 'application/json'},
        method: 'post',
        timeout: 60 * 1000,
        body: JSON.stringify({userID:userID, eventID:eventID})
    }, function (error, result, body) {
        if (error) {
            console.log(error);
        } else if (result.statusCode === 500) {
            console.log('error');
        } else {
            console.log(body);
        }
    });
}

exports.addEventToCreator = (eventID, userID) => {
    new Promise((resolve, reject) => {
        requestPromise({
            url: 'http://localhost:4000/api/v1/users/event/create',
            headers: {'content-type' : 'application/json'},
            method: 'post',
            timeout: 60 * 1000,
            body: JSON.stringify({userID:userID, eventID:eventID}),
            JSON:true
        })
        .then((response) => resolve({ status: 201, message: 'You Joined Sucessfully !' }))

        .catch((err) => {
            console.log(err);
            reject({ status: 500, message: 'Internal Server Error !' })
        })
    });
}

exports.acceptUserToEvent = (userID, eventID) => {
    new Promise((resolve, reject) => {
        requestPromise({
            url: 'http://localhost:4000/api/v1/users/event/accept',
            headers: {'content-type' : 'application/json'},
            method: 'post',
            timeout: 60 * 1000,
            body: JSON.stringify({userID:userID, eventID:eventID}),
            JSON:true
        })
        .then((response) => resolve({ status: 201, message: 'User Accepted Sucessfully !' }))

        .catch((err) => {
            console.log(err);
            reject({ status: 500, message: 'Internal Server Error !' })
        })
    });
}

exports.declineUserToEvent = (userID, eventID) => {
    new Promise((resolve, reject) => {
        requestPromise({
            url: 'http://localhost:4000/api/v1/users/event/decline',
            headers: {'content-type' : 'application/json'},
            method: 'post',
            timeout: 60 * 1000,
            body: JSON.stringify({userID:userID, eventID:eventID}),
            JSON:true
        })
        .then((response) => resolve({ status: 201, message: 'User Declined Sucessfully !' }))

        .catch((err) => {
            console.log(err);
            reject({ status: 500, message: 'Internal Server Error !' })
        })
    });
}

exports.sendNotification = (message, id) => {
    request({
        url: 'http://localhost:4004/api/v1/notifications/post',
        headers: {'content-type' : 'application/json'},
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

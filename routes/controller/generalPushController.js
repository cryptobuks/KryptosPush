"use strict";
var gcm = require('node-gcm');
var apn = require('apn');
var q = require('q');
var fs = require("fs");

var dbUtil = require("../../config/dbUtil");
var ObjectId = require('mongodb').ObjectID;
var apiKey = "AIzaSyDfBqVWxeEdA8dfOyxSE7feR8SbXhfo7rY";

exports.sendPush = function(req, res, next) {

    if (req.body && req.body.title && req.body.body && req.body.devices && req.body.bundleId) {

        var title = req.body.title;
        var body = req.body.body;
        var devices = req.body.devices;
        var bundleId = req.body.bundleId;
        var postId = Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1);
        var deviceIOS = [];
        var deviceAndroid = [];

        for (var i = 0; i < devices.length; i++) {
            if (devices[i].type == 'Android') {
                deviceAndroid.push(devices[i].ID);
            } else {
                deviceIOS.push(devices[i].ID);
            }
        }

        if (deviceAndroid.length > 0) {
            var service = new gcm.Sender(apiKey);
            var message = new gcm.Message();
            message.addData('title', title);
            message.addData('message', body);
            message.addData('image', 'www/icon.png');

            message.addData('notId', parseInt(Math.random() * 10000));
            message.addData('content-available', 1);
            console.log(message);
            service.send(message, {
                registrationTokens: deviceAndroid
            }, function(err, response) {
                if (err) {
                    console.error(err + " " + response);
                } else {
                    res.json({
                        "success": "Notification sent"
                    });
                }
            });

        }

        if (deviceIOS.length > 0) {
            var options = {};
            options.token={
                            key: "./APNKey/APNSAuthKey_G8VD8LMAWQ.p8",
                            keyId: "G8VD8LMAWQ",
                            teamId: "4CL3P3CWEQ",
                    }
            options["production"] = true;

            var iOSTokens = [];
            
            let apnProvider = new apn.Provider(options);

            console.log(iOSTokens);
            let notification = new apn.Notification();
            notification.title = title;
            notification.body = body;
            notification.topic = bundleId;

            apnProvider.send(notification,deviceIOS).then( (result) => {
                        res.json({
                            "success": "Notification sent"
                        });
                        //console.log(result);
                        //console.log(JSON.stringify(result.failed[0].response));
                });
        }

    }else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}

exports.sendGeneralPush = function(req, res, next) {

    if (req.body && req.body.title && req.body.body && req.body.devices && req.body.bundleId && req.body.gcmKey) {

        var title = req.body.title;
        var body = req.body.body;
        var devices = req.body.devices;
        var bundleId = req.body.bundleId;
        var gcmKey = req.body.gcmKey;
        var postId = Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1);
        var deviceIOS = [];
        var deviceAndroid = [];

        for (var i = 0; i < devices.length; i++) {
            if (devices[i].type == 'Android') {
                deviceAndroid.push(devices[i].ID);
            } else {
                deviceIOS.push(devices[i].ID);
            }
        }

        if (deviceAndroid.length > 0) {
            var service = new gcm.Sender(gcmKey);
            var message = new gcm.Message();
            message.addData('title', title);
            message.addData('message', body);
            message.addData('image', 'www/icon.png');

            message.addData('notId', parseInt(Math.random() * 10000));
            message.addData('content-available', 1);
            //console.log(message);
            service.send(message, {
                registrationTokens: deviceAndroid
            }, function(err, response) {
                if (err) {
                    console.error(err + " " + response);
                } else {
                    res.json({
                        "success": "Notification sent"
                    });
                }
            });

        }

        if (deviceIOS.length > 0) {
            var options = {};
            options.token={
                            key: "./APNKey/APNSAuthKey_G8VD8LMAWQ.p8",
                            keyId: "G8VD8LMAWQ",
                            teamId: "4CL3P3CWEQ",
                    }
            options["production"] = true;

            var iOSTokens = [];
            
            let apnProvider = new apn.Provider(options);

            //console.log(iOSTokens);
            let notification = new apn.Notification();
            notification.title = title;
            notification.body = body;
            notification.topic = bundleId;

            apnProvider.send(notification,deviceIOS).then( (result) => {
                        res.json({
                            "success": "Notification sent"
                        });
                        //console.log(result);
                        //console.log(JSON.stringify(result.failed[0].response));
                });
        }

    }else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}
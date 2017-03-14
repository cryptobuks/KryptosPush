"use strict";
var gcm = require('node-gcm');
var apn = require('apn');
var q = require('q');
var fs = require("fs");

var dbUtil = require("../../config/dbUtil");
var ObjectId = require('mongodb').ObjectID;
var pushConfig = require('../../config/pushConfig');
exports.addTenantPushKeys = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.bundleId && req.body.gcmKey) {

        var tenant = req.body.tenant;
        var gcmKey = req.body.gcmKey;
        var bundleId = req.body.bundleId;
        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_PUSH_TENANTKEYS";
                db.collection(tableName).find({
                    "tenant": tenant
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length > 0) {
                        res.json({
                            "error": "Keys already registered."
                        });
                    } else {
                        var cert = fs.readFileSync("cert.pem", {
                            'encoding': 'utf8'
                        });
                        //var key = fs.readFileSync("key.pem");

                        //console.log(cert);

                        var data = {
                            'tenant': tenant,
                            'gcmKey': gcmKey,
                            'bundleId': bundleId
                        };
                        db.collection(tableName).insertOne(data, function(err, result3) {
                            res.json({
                                "success": "Keys added successfully"
                            });
                        });
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing tenant, cert, key, bundleId or gcmKey"
        });
    }
}


exports.updateTenantPushKeys = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.gcmKey && req.body.bundleId) {

        var tenant = req.body.tenant;
        var gcmKey = req.body.gcmKey;
        var bundleId = req.body.bundleId;
        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_PUSH_TENANTKEYS";
                db.collection(tableName).find({
                    "tenant": tenant
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length == 0) {
                        res.json({
                            "error": "tenant not found"
                        });
                    } else {
                        var data = {
                            'tenant': tenant,
                            'gcmKey': gcmKey,
                            'bundleId': bundleId
                        };
                        db.collection(tableName).updateOne({
                            "tenant": tenant
                        }, {
                            $set: {
                                'tenant': tenant,
                                'gcmKey': gcmKey,
                                'bundleId': bundleId
                            }
                        }, function(err, result3) {
                            res.json({
                                "success": "keys updated successfully"
                            });
                        });
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing, tenant, cert or key"
        });
    }
}


exports.getTenantPushKeys = function(req, res, next) {
    if (req.body && req.body.tenant) {

        var tenant = req.body.tenant;
        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_PUSH_TENANTKEYS";
                db.collection(tableName).find({
                    "tenant": tenant
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length == 0) {
                        res.json({
                            "error": "tenant not found"
                        });
                    } else {
                        res.json(result[0]);
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing tenant, cert or key"
        });
    }
}



exports.adddevice = function(req, res, next) {
    if (req.body && req.body.id && req.body.tenant && req.body.type && req.body.channel) {

        var tenant = req.body.tenant;
        var ID = req.body.id;
        var type = req.body.type;
        var channel = req.body.channel;
        var others = (req.body.other == null || req.body.other == undefined) ? '' : req.body.other;

        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_DEVICES";
                db.collection(tableName).find({
                    "ID": ID
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length > 0) {
                        res.json({
                            "error": "Device already registered."
                        });
                    } else {
                        var data = {
                            'ID': ID,
                            'type': type,
                            'channel': channel,
                            'others': others,
                        };

                        db.collection(tableName).insertOne(data, function(err, result3) {
                            res.json({
                                "success": "Device subscribed"
                            });
                        });
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}



exports.adddeviceToChannel = function(req, res, next) {
    if (req.body && req.body.id && req.body.tenant && req.body.type && req.body.channel) {

        var tenant = req.body.tenant;
        var ID = req.body.id;
        var type = req.body.type;
        var channel = req.body.channel;
        var others = (req.body.other == null || req.body.other == undefined) ? '' : req.body.other;

        try {

            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_" + channel + "_DEVICES";
                db.collection(tableName).find({
                    "ID": ID
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length > 0) {
                        res.json({
                            "error": "Device already registered."
                        });
                    } else {
                        var data = {
                            'ID': ID,
                            'type': type,
                            'others': others
                        };

                        db.collection(tableName).insertOne(data, function(err, result3) {
                            res.json({
                                "success": "Device subscribed"
                            });
                        });
                    }
                });
            });

        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}




exports.updateDevice = function(req, res, next) {
    if (req.body && req.body.id && req.body.tenant && req.body.type && req.body.channel) {

        var tenant = req.body.tenant;
        var ID = req.body.id;
        var type = req.body.type;
        var channel = req.body.channel;
        var others = (req.body.other == null || req.body.other == undefined) ? '' : req.body.other;

        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_DEVICES";
                db.collection(tableName).find({
                    "ID": ID
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length > 0) {
                        var data = {
                            'ID': ID,
                            'type': type,
                            'channel': channel,
                            'others': others
                        };
                        db.collection(tableName).updateOne({
                            "ID": ID
                        }, {
                            $set: data
                        }, function(err, result3) {
                            res.json({
                                "success": "Device updated successfully"
                            });
                        });
                    } else {
                        res.json({
                            "error": "Device is not registered."
                        });
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}

exports.getAllDevices = function(req, res, next) {
    if (req.body && req.body.tenant) {
        var tenant = req.body.tenant;
        var ID = req.body.id;
        if (ID == null || ID == undefined) {
            try {
                dbUtil.getConnection(function(db) {
                    var tableName = "T_" + tenant + "_DEVICES";
                    db.collection(tableName).find({}).toArray(function(err, result) {
                        if (result.length > 0) {
                            res.json(result);
                        }
                    });
                });
            } catch (e) {
                console.log(e)
            }
        } else {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_DEVICES";
                db.collection(tableName).find({
                    "ID": ID
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length > 0) {
                        res.json(result);
                    } else {
                        res.json({
                            "error": "Device is not registered."
                        });
                    }
                });
            });

        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}




exports.getChannelDevices = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.channel) {
        var tenant = req.body.tenant;
        var channel = req.body.channel;
        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_" + channel + "_DEVICES";
                db.collection(tableName).find({}).toArray(function(err, result) {
                    if (result.length > 0) {
                        res.json(result);
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}


exports.getChannelDevicesCount = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.channel) {
        var tenant = req.body.tenant;
        var channel = req.body.channel;
        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_" + channel + "_DEVICES";
                db.collection(tableName).count(function(err, result) {
                    res.json({"count":result});
                });
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}




var pushLogEntry = function(tenant, data) {
    console.log(data);
    dbUtil.getConnection(function(db) {
        var tableName = "T_" + tenant + "_PUSHLOGS";
        db.collection(tableName).updateOne({
            "_id": data._id
        }, {
            $set: data
        }, function(err, result3) {});

    });

}

var groupCount = 0;
var sendRes;
var AndroidGrouplogs = [];
var sendGroupAndroidPushes = function(AllDevices, message, pushData, tenant) {
    //console.log(typeof groupCount);
    //console.log(AllDevices[groupCount]);
    dbUtil.getConnection(function(db) {
        var tableName = "T_PUSH_TENANTKEYS";
        db.collection(tableName).find({
            "tenant": tenant
        }).toArray(function(err, result) {
            console.log(result);
            if (result.length == 0) {
                res.json({
                    "error": "tenant not found"
                });
            } else {
                var apiKey = result[0].gcmKey
                var service = new gcm.Sender(apiKey);
                service.send(message, {
                    registrationTokens: AllDevices[groupCount]
                }, function(err, response) {
                    if (err) {
                        groupCount = groupCount + 1;
                        if (groupCount < AllDevices.length) {
                            sendGroupAndroidPushes(AllDevices, message, pushData, tenant);
                        }
                    } else {

                        AndroidGrouplogs.push(response);

                        groupCount = groupCount + 1;
                        if (groupCount < AllDevices.length) {
                            sendGroupAndroidPushes(AllDevices, message, pushData, tenant);
                        } else {
                            pushData.AndroidDevicesLogs = AndroidGrouplogs;
                            pushLogEntry(tenant, pushData);
                            sendRes.json({
                                "success": "Notification sent"
                            });
                        }
                    }
                });
            }
        })
    });


}


exports.sendPushToChannel = function(req, res, next) {

    if (req.body && req.body.tenant && req.body.channel && req.body.channelId && req.body.title && req.body.body) {
        sendRes = res;
        var tenant = req.body.tenant;
        var channel = req.body.channel;
        var channelId = req.body.channelId;
        var title = req.body.title;
        var body = req.body.body;
        var actions = req.body.actions;
        var addData = req.body.addData;
        var picture = req.body.picture;
        var appletName = req.body.appletName;
        var deviceType = req.body.deviceType;
        var userEmail = req.body.userEmail;
        var userImage = req.body.userImage;
        var postedBy = req.body.postedBy;
        var picture = req.body.picture;
        var postId = Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1) + "" + Math.floor((Math.random() * 10) + 1);
        var deviceIOS = [];
        var deviceAndroid = [];


        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_FEED";
                var dateTimeStamp = new Date();
                var feedData = {
                    'userEmail': userEmail,
                    'userImage': userImage,
                    'postedBy': postedBy,
                    'title': title,
                    'channel': channel,
                    'channelId': channelId,
                    'body': body,
                    'picture': (picture == undefined ? '' : picture),
                    'likes': '',
                    'cmnts': '',
                    'views': '',
                    'postId': postId,
                    'date': dateTimeStamp.toString()
                };

                db.collection(tableName).insertOne(feedData, function(err, result3) {
                    var tableName = "T_" + tenant + "_" + channelId + "_FEED";
                    db.collection(tableName).insertOne(feedData, function(err, result3) {
                        dbUtil.getConnection(function(db) {
                            var tableName = "T_" + tenant + "_PUSHLOGS";
                            var data = {
                                'title': title,
                                'channel': channel,
                                'body': body,
                                'appleDevicesLogs': '',
                                'AndroidDevicesLogs': ''
                            };


                            db.collection(tableName).insertOne(data, function(err, result3) {
                                console.log(data);
                                var pushData = data;
                                var ChannelDevices = [];
                                var chlen = 0;
                                /* Recursive function to get diff channel devices */
                                var getDevices = function() {
                                    dbUtil.getConnection(function(db) {
                                        var tableName = "T_" + tenant + "_" + channel[chlen] + "_DEVICES";
                                        console.log(tableName);

                                        if (deviceType == "all" || deviceType == undefined || deviceType == null) {
                                            var filterQuery = {}
                                        } else if (deviceType == "Android") {
                                            var filterQuery = {
                                                "type": "Android"
                                            }
                                        } else {
                                            var filterQuery = {
                                                "type": "iOS"
                                            }
                                        }
                                        console.log(filterQuery);
                                        db.collection(tableName).find(filterQuery, {
                                            _id: 0
                                        }).toArray(function(err, result) {
                                            if (result.length > 0) {
                                                //console.log(result);

                                                for (var i = 0; i < result.length; i++) {
                                                    if (result[i].type == "iOS") {
                                                        deviceIOS.push(result[i].ID);
                                                    } else {
                                                        deviceAndroid.push(result[i].ID);
                                                    }
                                                }
                                                chlen = chlen + 1;
                                                //console.log(chlen+"   "+channel.length);
                                                if (chlen < channel.length) {
                                                    getDevices();
                                                } else {

                                                    /*checking redundant ID from diff channels*/
                                                    var iOSPushDevices = deviceIOS.filter(function(elem, index, self) {
                                                        return index == self.indexOf(elem);
                                                    });
                                                    var AndroidPushDevices = deviceAndroid.filter(function(elem, index, self) {
                                                        return index == self.indexOf(elem);
                                                    });

                                                    console.log("iOS devices" + iOSPushDevices);
                                                    console.log("Android devices" + AndroidPushDevices);

                                                    /* Send pushes to Android device */

                                                    /* checking if devices are more than 1000 */
                                                    if (AndroidPushDevices.length > 1000) {
                                                        var deviceGroup = [];
                                                        var AllDevices = [];
                                                        var devicesCount = 0;
                                                        for (var i = 0; i < AndroidPushDevices.length; i++) {

                                                            if (devicesCount == 1000) {
                                                                AllDevices.push(deviceGroup);
                                                                deviceGroup = [];
                                                                devicesCount = 0;
                                                                deviceGroup.push(AndroidPushDevices[i]);
                                                                devicesCount = devicesCount + 1;
                                                            } else {
                                                                deviceGroup.push(AndroidPushDevices[i]);
                                                                devicesCount = devicesCount + 1;
                                                            }
                                                        }
                                                        AllDevices.push(deviceGroup);
                                                        //console.log(AllDevices[1]);
                                                        var message = new gcm.Message();
                                                        message.addData('title', title);
                                                        message.addData('message', body);
                                                        message.addData('image', 'www/icon.png');
                                                        if (picture == "" || picture == null || picture == undefined) {} else {
                                                            message.addData('style', 'picture');
                                                            message.addData('picture', picture);
                                                            message.addData('summaryText', body);

                                                        }
                                                        message.addData('notId', parseInt(Math.random() * 10000));
                                                        message.addData('content-available', 1);

                                                        if (appletName == null || appletName == undefined) {} else {
                                                            message.addData("openApplet", appletName);
                                                        }

                                                        groupCount = 0;
                                                        sendGroupAndroidPushes(AllDevices, message, pushData, tenant);
                                                        //res.json(sendSuccess);
                                                    } else {
                                                        dbUtil.getConnection(function(db) {
                                                            var tableName = "T_PUSH_TENANTKEYS";
                                                            db.collection(tableName).find({
                                                                "tenant": tenant
                                                            }).toArray(function(err, result) {
                                                                console.log(result);
                                                                if (result.length == 0) {
                                                                    res.json({
                                                                        "error": "tenant not found"
                                                                    });
                                                                } else {
                                                                    var apiKey = result[0].gcmKey
                                                                    var service = new gcm.Sender(apiKey);
                                                                    var message = new gcm.Message();
                                                                    message.addData('title', title);
                                                                    message.addData('message', body);
                                                                    message.addData('image', 'www/icon.png');
                                                                    if (picture == "" || picture == null || picture == undefined) {} else {
                                                                        message.addData('style', 'picture');
                                                                        message.addData('picture', picture);
                                                                        message.addData('summaryText', body);

                                                                    }
                                                                    message.addData('notId', parseInt(Math.random() * 10000));
                                                                    message.addData('content-available', 1);

                                                                    if (appletName == null || appletName == undefined) {} else {
                                                                        message.addData("openApplet", appletName);
                                                                    }
                                                                    /*message.addData('actions', [
                                                                        { icon: "emailGuests", title: "EMAIL GUESTS", callback: "app.emailGuests"},
                                                                        { icon: "snooze", title: "SNOOZE", callback: "app.snooze"},
                                                                    ]);*/

                                                                    console.log(apiKey);

                                                                    service.send(message, {
                                                                        registrationTokens: AndroidPushDevices
                                                                    }, function(err, response) {
                                                                        if (err) {
                                                                            console.error(err + " " + response);
                                                                        } else { //console.log(response);
                                                                            pushData.AndroidDevicesLogs = response;
                                                                            res.json({
                                                                                "success": "Notification sent"
                                                                            });
                                                                            pushLogEntry(tenant, pushData);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        });


                                                    }


                                                    if (iOSPushDevices.length > 0) {
                                                        var options = {};
                                                        /*options.token = {
                                                            key: "./APNKey/APNSAuthKey_G8VD8LMAWQ.p8",
                                                            keyId: "G8VD8LMAWQ",
                                                            teamId: "4CL3P3CWEQ",
                                                        }*/
                                                        options.token = pushConfig.getPushConfig(tenant);
                                                        options["production"] = true;

                                                        let apnProvider = new apn.Provider(options);
                                                        let notification = new apn.Notification();
                                                        notification.title = title;
                                                        notification.body = body;
                                                        notification.sound = "ping.aiff";
                                                        var iOSBundleID;
                                                        dbUtil.getConnection(function(db) {
                                                            var tableName = "T_PUSH_TENANTKEYS";
                                                            db.collection(tableName).find({
                                                                "tenant": tenant
                                                            }).toArray(function(err, result) {
                                                                console.log(result);
                                                                if (result.length == 0) {
                                                                    res.json({
                                                                        "error": "tenant not found"
                                                                    });
                                                                } else {
                                                                    notification.topic = result[0].bundleId;
                                                                    apnProvider.send(notification, iOSPushDevices).then((result) => {
                                                                        res.json({
                                                                            "success": "Notification sent"
                                                                        });
                                                                    });
                                                                }
                                                            });
                                                        });
                                                        console.log("Ios Push");

                                                    }
                                                }
                                            } else {
                                                res.json({
                                                    "error": "No registered devices found."
                                                });
                                            }
                                        });
                                    });
                                }

                                if (chlen == channel.length) {} else {
                                    getDevices();
                                }




                            });

                        });

                    });
                });




            });




        } catch (e) {
            console.log(e)
        }
    } else {}

}

exports.sendPushToDevice = function(req, res, next) {

    if (req.body && req.body.tenant && req.body.id && req.body.title && req.body.body) {

        var tenant = req.body.tenant;
        var id = req.body.id;
        var title = req.body.title;
        var body = req.body.body;
        var deviceIOS = [];
        var deviceAndroid = [];
        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_DEVICES";
                db.collection(tableName).find({
                    "ID": id
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length > 0) {

                        //console.log("iOS"+ deviceIOS);console.log("Android"+ deviceAndroid);
                        if (result[0].type == "Android") {
                            var service = new gcm.Sender(apiKey);
                            var message = new gcm.Message();
                            message.addData('title', title);
                            //message.addData('style', 'picture');
                            //message.addData('picture', 'http://36.media.tumblr.com/c066cc2238103856c9ac506faa6f3bc2/tumblr_nmstmqtuo81tssmyno1_1280.jpg');
                            message.addData('message', body);
                            /*message.addData('actions', [
                                { icon: "emailGuests", title: "EMAIL GUESTS", callback: "app.emailGuests"},
                                { icon: "snooze", title: "SNOOZE", callback: "app.snooze"},
                            ]);*/

                            service.send(message, {
                                registrationTokens: [result[0].ID]
                            }, function(err, response) {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.log(response);
                                    /*res.json({
                                        "success": "Notification sent"
                                    });*/
                                }
                            });

                        } else {
                            //console.log(deviceIOS);
                            var options = {};
                            options["production"] = true;
                            dbUtil.getConnection(function(db) {
                                var tableName = "T_PUSH_TENANTKEYS";
                                db.collection(tableName).find({
                                    "tenant": tenant
                                }).toArray(function(err, result) {
                                    console.log(result);
                                    if (result.length == 0) {
                                        res.json({
                                            "error": "tenant not found"
                                        });
                                    } else {
                                        options["cert"] = result[0].cert;
                                        options["key"] = result[0].key;
                                    }
                                });
                            });
                            //options["cert"] = "cert.pem";
                            //options["key"] = "key.pem";



                            var apnConnection = new apn.Connection(options)
                            var myDevice = new apn.Device(result[0].ID);


                            var note = new apn.Notification();
                            note.title = title;
                            note.sound = "ping.aiff";
                            note.alert = {
                                'title': title,
                                'body': body,
                                'openApplet': appletName,
                                'click-action': 'View Notification',
                                'launch-image': picture
                            };
                            note['content-available'] = 1;

                            apnConnection.pushNotification(note, myDevice);
                            var options = {
                                "batchFeedback": true,
                                "interval": 300
                            };

                            var feedback = new apn.Feedback(options);
                            feedback.on("feedback", function(devices) {
                                devices.forEach(function(item) {
                                    console.log(item.device + "   " + item.time);
                                });
                            });
                        }
                    } else {
                        res.json({
                            "error": "Device is not registered."
                        });
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}


exports.getPushLogs = function(req, res, next) {
    if (req.body && req.body.tenant) {
        var tenant = req.body.tenant;
        dbUtil.getConnection(function(db) {
            var tableName = "T_" + tenant + "_PUSHLOGS";
            db.collection(tableName).find({}).toArray(function(err, result) {
                console.log(result);
                if (result.length > 0) {
                    res.json(result);
                } else {
                    res.json({
                        "error": "No logs found."
                    });
                }
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}

exports.getTenantFeed = function(req, res, next) {
    if (req.body && req.body.tenant) {
        var tenant = req.body.tenant;
        var postObjectID = req.body.postObjectID;
        if(postObjectID == undefined || postObjectID == null || postObjectID == ""){
            var query={};
        }else{
            //find({_id:{"$lt":ObjectId("57f40cd17024aeb4d132b272")}}).limit(5).sort({"_id":-1})
            var query={_id:{"$lt":ObjectId(postObjectID)}}
        }
        dbUtil.getConnection(function(db) {
            var tableName = "T_" + tenant + "_FEED";
            db.collection(tableName).find(query).limit(5).sort({
                _id: -1
            }).toArray(function(err, result) {
                //console.log(result);
                if (result.length > 0) {
                db.collection(tableName).count(function(err,counts){
                    res.json({"posts":result,"postCounts":counts});
                });
                } else {
                    db.collection(tableName).count(function(err,counts){
                    res.json({"posts":[],"postCounts":counts});
                    });
                }
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}


exports.getTenantChannelFeed = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.channelId) {
        var tenant = req.body.tenant;
        var channelId = req.body.channelId;
        var postObjectID = req.body.postObjectID;
        if(postObjectID == undefined || postObjectID == null || postObjectID == ""){
            var query={};
        }else{
            //find({_id:{"$lt":ObjectId("57f40cd17024aeb4d132b272")}}).limit(5).sort({"_id":-1})
            var query={_id:{"$lt":ObjectId(postObjectID)}}
        }
        dbUtil.getConnection(function(db) {
            var tableName = "T_" + tenant + "_" + channelId + "_FEED";
            db.collection(tableName).find(query).limit(5).sort({
                _id: -1
            }).toArray(function(err, result) {
                //console.log(result);
                if (result.length > 0) {
                db.collection(tableName).count(function(err,counts){
                    res.json({"posts":result,"postCounts":counts});
                });
                } else {
                    db.collection(tableName).count(function(err,counts){
                    res.json({"posts":[],"postCounts":counts});
                    });

                }
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}


exports.deleteDeviceFromChannel = function(req, res, next) {
    if (req.body && req.body.id && req.body.tenant && req.body.channel) {

        var tenant = req.body.tenant;
        var ID = req.body.id;
        var channel = req.body.channel;

        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_" + channel + "_DEVICES";
                db.collection(tableName).find({
                    "ID": ID
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length > 0) {
                        db.collection(tableName).deleteOne({
                            "ID": ID
                        }, function(err, result3) {
                            res.json({
                                "success": "Device deleted successfully"
                            });
                        });
                    } else {
                        res.json({
                            "error": "Device is not registered."
                        });
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}

exports.createChannel = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.channel && req.body.channelId) {
        var tenant = req.body.tenant;
        var channel = req.body.channel;
        var channelId = req.body.channelId;
        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_CHANNELS";
                db.collection(tableName).find({
                    "channelId": channelId
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length > 0) {
                        res.json({
                            "error": "Channel already added"
                        });
                    } else {
                        var data = {
                            'tenant': tenant,
                            'channel': channel,
                            'channelId': channelId
                        };
                        db.collection(tableName).insertOne(data, function(err, result3) {
                            res.json({
                                "success": "channel added successfully"
                            });
                        });
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing tenant, channel, channelId"
        });
    }
}

exports.getChannels = function(req, res, next) {
    if (req.body && req.body.tenant) {
        var tenant = req.body.tenant;
        dbUtil.getConnection(function(db) {
            var tableName = "T_" + tenant + "_CHANNELS";
            db.collection(tableName).find().sort({
                _id: -1
            }).toArray(function(err, result) {
                console.log(result);
                if (result.length > 0) {
                    res.json(result);
                } else {
                    res.json({
                        "error": "No channel found."
                    });
                }
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}

exports.likePost = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.channelId && req.body.postId && req.body.useremail && req.body.username) {
        var tenant = req.body.tenant;
        var channelId = req.body.channelId;
        var postId = req.body.postId;
        var useremail = req.body.useremail;
        var username = req.body.username;
        var userimg = req.body.userimg;

        dbUtil.getConnection(function(db) {
            var tableName = "T_" + tenant + "_FEED";
            db.collection(tableName).find({
                "postId": postId
            }).toArray(function(err, result) {
                console.log(result);
                var likes = result[0].likes;
                if (likes == '') {
                    likes = 1;
                } else {
                    likes = likes + 1;
                }
                db.collection(tableName).updateOne({
                    "postId": postId
                }, {
                    $set: {
                        "likes": likes
                    }
                }, function(err, result3) {
                    var tableName = "T_" + tenant + "_" + channelId + "_FEED";
                    db.collection(tableName).updateOne({
                        "postId": postId
                    }, {
                        $set: {
                            "likes": likes
                        }
                    }, function(err, result3) {
                        //res.json({'success':'post liked'})
                        var tableName = "T_" + tenant + "_" + channelId + "_POSTLIKES"

                        db.collection(tableName).find({
                            "postId": postId
                        }).toArray(function(err, result) {
                            if (result.length == 0) {
                                var user = [];
                                user.push({
                                    'un': username,
                                    'email': useremail,
                                    'img': userimg
                                });
                                var likesData = {
                                    "postId": postId,
                                    "users": user
                                }
                                db.collection(tableName).insertOne(likesData, function(err, result3) {
                                    var tableName = "T_" + tenant + "_USERLIKEDPOSTS";
                                    db.collection(tableName).find({
                                        "email": useremail
                                    }).toArray(function(err, result) {
                                        console.log(result);
                                        if (result.length > 0) {
                                            var posts = result[0].posts;
                                            posts.push(postId);
                                            db.collection(tableName).updateOne({
                                                "email": useremail
                                            }, {
                                                $set: {
                                                    "posts": posts
                                                }
                                            }, function(err, result3) {
                                                res.json({
                                                    "success": "post liked"
                                                });
                                            });
                                        } else {
                                            var post = [];
                                            post.push(postId)
                                            var data = {
                                                'tenant': tenant,
                                                'email': useremail,
                                                'posts': post
                                            };
                                            db.collection(tableName).insertOne(data, function(err, result3) {
                                                res.json({
                                                    "success": "post liked"
                                                });
                                            });
                                        }
                                    });
                                    /*res.json({
                                        "success": "post liked"
                                    });*/
                                });
                            } else {
                                var users = result[0].users;
                                users.push({
                                    'un': username,
                                    'email': useremail,
                                    'img': userimg
                                });
                                db.collection(tableName).updateOne({
                                    "postId": postId
                                }, {
                                    $set: {
                                        "users": users
                                    }
                                }, function(err, result3) {
                                    var tableName = "T_" + tenant + "_USERLIKEDPOSTS";
                                    db.collection(tableName).find({
                                        "email": useremail
                                    }).toArray(function(err, result) {
                                        console.log(result);
                                        if (result.length > 0) {
                                            var posts = result[0].posts;
                                            posts.push(postId);
                                            db.collection(tableName).updateOne({
                                                "email": useremail
                                            }, {
                                                $set: {
                                                    "posts": posts
                                                }
                                            }, function(err, result3) {
                                                res.json({
                                                    "success": "post liked"
                                                });
                                            });
                                        } else {
                                            var post = [];
                                            post.push(postId)
                                            var data = {
                                                'tenant': tenant,
                                                'email': useremail,
                                                'posts': post
                                            };
                                            db.collection(tableName).insertOne(data, function(err, result3) {
                                                res.json({
                                                    "success": "post liked"
                                                });
                                            });
                                        }
                                    });
                                });
                            }
                        });

                    });
                });
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}


exports.deleteLikePost = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.channelId && req.body.postId && req.body.useremail && req.body.username) {
        var tenant = req.body.tenant;
        var channelId = req.body.channelId;
        var postId = req.body.postId;
        var useremail = req.body.useremail;
        var username = req.body.username;
        var userimg = req.body.userimg;

        dbUtil.getConnection(function(db) {
            var tableName = "T_" + tenant + "_FEED";
            db.collection(tableName).find({
                "postId": postId
            }).toArray(function(err, result) {
                console.log(result);
                var likes = result[0].likes;
                if (likes == '') {} else {
                    likes = likes - 1;
                }
                db.collection(tableName).updateOne({
                    "postId": postId
                }, {
                    $set: {
                        "likes": likes
                    }
                }, function(err, result3) {
                    var tableName = "T_" + tenant + "_" + channelId + "_FEED";
                    db.collection(tableName).updateOne({
                        "postId": postId
                    }, {
                        $set: {
                            "likes": likes
                        }
                    }, function(err, result3) {
                        //res.json({'success':'post liked'})
                        var tableName = "T_" + tenant + "_" + channelId + "_POSTLIKES"

                        db.collection(tableName).find({
                            "postId": postId
                        }).toArray(function(err, result) {
                            var likeData = result[0];
                            for (var i = 0; i < likeData.users.length; i++) {
                                if (useremail == likeData.users[i].email) {
                                    likeData.users.splice(i, 1);
                                    break;
                                }
                            }
                            db.collection(tableName).updateOne({
                                "postId": postId
                            }, {
                                $set: {
                                    "users": likeData.users
                                }
                            }, function(err, result3) {
                                /*res.json({
                                    "success": "post unliked"
                                });*/
                                var tableName = "T_" + tenant + "_USERLIKEDPOSTS";
                                db.collection(tableName).find({
                                    "email": useremail
                                }).toArray(function(err, result) {
                                    console.log(result);
                                    if (result.length > 0) {
                                        var data = result[0];
                                        for (var i = 0; i < data.posts.length; i++) {
                                            if (postId == data.posts[i]) {
                                                data.posts.splice(i, 1);

                                                break;
                                            }
                                        }
                                        db.collection(tableName).updateOne({
                                            "email": useremail
                                        }, {
                                            $set: {
                                                "posts": data.posts
                                            }
                                        }, function(err, result3) {
                                            res.json({
                                                "success": "post unliked"
                                            });
                                        });
                                    }
                                });
                            });
                        });

                    });
                });
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}



exports.getPostLikes = function(req, res, next) {
    if (req.body && req.body.tenant) {
        var tenant = req.body.tenant;
        var channelId = req.body.channelId;
        var postId = req.body.postId;

        var tableName = "T_" + tenant + "_" + channelId + "_POSTLIKES"
        dbUtil.getConnection(function(db) {
            db.collection(tableName).find({
                'postId': postId
            }).sort({
                _id: -1
            }).toArray(function(err, result) {
                console.log(result);
                if (result.length > 0) {
                    res.json(result);
                } else {
                    res.json({
                        "error": "No channel found."
                    });
                }
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}

exports.userLikedPost = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.email && req.body.postId) {
        var tenant = req.body.tenant;
        var email = req.body.email;
        var postId = req.body.postId;
        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_USERLIKEDPOSTS";
                db.collection(tableName).find({
                    "email": email
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length > 0) {
                        var data = result[0];
                        data.posts.push(postId);
                        db.collection(tableName).updateOne({
                            "email": email
                        }, {
                            $set: data
                        }, function(err, result3) {
                            res.json({
                                "success": "post added for user"
                            });
                        });
                    } else {
                        var post = [];
                        post.push(postId)
                        var data = {
                            'tenant': tenant,
                            'email': email,
                            'posts': post
                        };
                        db.collection(tableName).insertOne(data, function(err, result3) {
                            res.json({
                                "success": "post added for user"
                            });
                        });
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing tenant, channel, channelId"
        });
    }
}

exports.userUnLikePost = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.email && req.body.postId) {
        var tenant = req.body.tenant;
        var email = req.body.email;
        var postId = req.body.postId;
        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_USERLIKEDPOSTS";
                db.collection(tableName).find({
                    "email": email
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length > 0) {
                        var data = result[0];
                        for (var i = 0; i < data.posts.length; i++) {
                            if (postId == data.posts[i])
                                data.posts.splice(i, 1);
                            break;
                        }
                        db.collection(tableName).updateOne({
                            "email": email
                        }, {
                            $set: data
                        }, function(err, result3) {
                            res.json({
                                "success": "post unliked for user"
                            });
                        });
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing tenant, channel, channelId"
        });
    }
}

exports.getUserLikedPosts = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.email) {
        var tenant = req.body.tenant;
        var email = req.body.email;

        var tableName = "T_" + tenant + "_USERLIKEDPOSTS";
        dbUtil.getConnection(function(db) {
            db.collection(tableName).find({
                'email': email
            }).toArray(function(err, result) {
                console.log(result);
                if (result.length > 0) {
                    res.json(result);
                } else {
                    res.json({
                        "error": "User not found"
                    });
                }
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}


exports.postViews = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.channelId && req.body.postId) {
        var tenant = req.body.tenant;
        var postId = req.body.postId;
        var channelId = req.body.channelId;
        var tableName = "T_" + tenant + "_FEED";
        dbUtil.getConnection(function(db) {
            db.collection(tableName).find({
                'postId': postId
            }).toArray(function(err, result) {
                //console.log(result);
                if (result.length > 0) {
                    var views = result[0].views;

                    if (views == '') {
                        views = 1;
                    } else {
                        views = views + 1;
                    }
                    console.log(views);
                    db.collection(tableName).updateOne({
                        "postId": postId
                    }, {
                        //$set: postData
                        $set: {
                            "views": views
                        }
                    }, function(err, result3) {
                        //console.log("err"+err);
                        //console.log("result3"+result3);
                        res.json({
                            "success": "post viewed"
                        });
                    });
                } else {
                    res.json({
                        "error": "User not found"
                    });
                }
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}


exports.postComment = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.channelId && req.body.postId && req.body.comment && req.body.useremail && req.body.userimg && req.body.username) {
        var tenant = req.body.tenant;
        var postId = req.body.postId;
        var channelId = req.body.channelId;
        var comment = req.body.comment;
        var useremail = req.body.useremail;
        var userimage = req.body.userimg;
        var username = req.body.username;
        var date = new Date();
        var deviceIOS = [];
        var deviceAndroid = [];
        var appletName = "Home4";
        dbUtil.getConnection(function(db) {
            var tableName = "T_" + tenant + "_FEED";
            db.collection(tableName).find({
                "postId": postId
            }).toArray(function(err, result) {
                //console.log(result);
                var cmnts = result[0].cmnts;
                if (cmnts == '') {
                    cmnts = 1;
                } else {
                    cmnts = cmnts + 1;
                }
                db.collection(tableName).updateOne({
                    "postId": postId
                }, {
                    $set: {
                        "cmnts": cmnts
                    }
                }, function(err, result3) {
                    var tableName = "T_" + tenant + "_" + channelId + "_FEED";
                    db.collection(tableName).updateOne({
                        "postId": postId
                    }, {
                        $set: {
                            "cmnts": cmnts
                        }
                    }, function(err, result3) {
                        //res.json({'success':'post liked'})
                        var tableName = "T_" + tenant + "_" + channelId + "_POSTCOMMENTS"

                        db.collection(tableName).find({
                            "postId": postId
                        }).toArray(function(err, result) {
                            if (result.length == 0) {
                                var user = [];
                                user.push({
                                    'un': username,
                                    'email': useremail,
                                    'img': userimage,
                                    'cmnt': comment,
                                    'date': date.toString()
                                });
                                var cmntData = {
                                    "postId": postId,
                                    "users": user
                                }
                                db.collection(tableName).insertOne(cmntData, function(err, result3) {
                                    //res.json({'success':'comment posted'});
                                    dbUtil.getConnection(function(db) {
                                        var tableName = "T_" + tenant + "_" + channelId + "_DEVICES";
                                        console.log(tableName);
                                        db.collection(tableName).find({}, {
                                            _id: 0
                                        }).toArray(function(err, result) {
                                            //console.log("result"+result);
                                            if (result.length > 0) {
                                                console.log(result);

                                                for (var i = 0; i < result.length; i++) {
                                                    if (result[i].type == "iOS") {
                                                        deviceIOS.push(result[i].ID);
                                                    } else {
                                                        deviceAndroid.push(result[i].ID);
                                                    }
                                                }
                                                /*checking redundant ID from diff channels*/
                                                var iOSPushDevices = deviceIOS.filter(function(elem, index, self) {
                                                    return index == self.indexOf(elem);
                                                });
                                                var AndroidPushDevices = deviceAndroid.filter(function(elem, index, self) {
                                                    return index == self.indexOf(elem);
                                                });

                                                console.log("iOS devices" + iOSPushDevices);
                                                console.log("Android devices" + AndroidPushDevices);

                                                /* Send pushes to Android device */

                                                /* checking if devices are more than 1000 */
                                                if (false) {}
                                                /*if (AndroidPushDevices.length > 1000) {
                                                    var deviceGroup = [];
                                                    var AllDevices = [];
                                                    var devicesCount = 0;
                                                    for (var i = 0; i < AndroidPushDevices.length; i++) {

                                                        if (devicesCount == 1000) {
                                                            AllDevices.push(deviceGroup);
                                                            deviceGroup = [];
                                                            devicesCount = 0;
                                                            deviceGroup.push(AndroidPushDevices[i]);
                                                            devicesCount = devicesCount + 1;
                                                        } else {
                                                            deviceGroup.push(AndroidPushDevices[i]);
                                                            devicesCount = devicesCount + 1;
                                                        }
                                                    }
                                                    AllDevices.push(deviceGroup);
                                                    //console.log(AllDevices[1]);
                                                    var message = new gcm.Message();
                                                    message.addData('title', title);
                                                    message.addData('message', body);
                                                    message.addData('image', 'www/icon.png');
                                                    if (picture == "" || picture == null || picture == undefined) {} else {
                                                        message.addData('style', 'picture');
                                                        message.addData('picture', picture);
                                                        message.addData('summaryText', body);

                                                    }
                                                    message.addData('notId', parseInt(Math.random() * 10000));
                                                    message.addData('content-available', 1);

                                                    if (appletName == null || appletName == undefined) {} else {
                                                        message.addData("openApplet", appletName);
                                                    }

                                                    groupCount = 0;
                                                    sendGroupAndroidPushes(AllDevices, message, pushData, tenant);
                                                    //res.json(sendSuccess);*/
                                                else {
                                                    dbUtil.getConnection(function(db) {
                                                        var tableName = "T_PUSH_TENANTKEYS";
                                                        db.collection(tableName).find({
                                                            "tenant": tenant
                                                        }).toArray(function(err, result) {
                                                            console.log(result);
                                                            if (result.length == 0) {
                                                                res.json({
                                                                    "error": "tenant not found"
                                                                });
                                                            } else {
                                                                var apiKey = result[0].gcmKey;
                                                                var service = new gcm.Sender(apiKey);
                                                                var message = new gcm.Message();
                                                                message.addData('title', username + " posted a comment.");
                                                                message.addData('message', comment);
                                                                message.addData('image', 'www/icon.png');
                                                                message.addData('notId', parseInt(Math.random() * 10000));
                                                                message.addData('content-available', 1);

                                                                if (appletName == null || appletName == undefined) {} else {
                                                                    message.addData("openApplet", appletName);
                                                                }
                                                                /*message.addData('actions', [
                                                                    { icon: "emailGuests", title: "EMAIL GUESTS", callback: "app.emailGuests"},
                                                                    { icon: "snooze", title: "SNOOZE", callback: "app.snooze"},
                                                                ]);*/

                                                                console.log(apiKey);

                                                                service.send(message, {
                                                                    registrationTokens: AndroidPushDevices
                                                                }, function(err, response) {
                                                                    if (err) {
                                                                        console.error(err + " " + response);
                                                                    } else { //console.log(response);

                                                                        res.json({
                                                                            "success": "Comment/Notification sent"
                                                                        });

                                                                    }
                                                                });
                                                            }
                                                        });
                                                    });


                                                }


                                                if (iOSPushDevices.length > 0) {
                                                    var options = {};
                                                    /*options.token = {
                                                        key: "./APNKey/APNSAuthKey_G8VD8LMAWQ.p8",
                                                        keyId: "G8VD8LMAWQ",
                                                        teamId: "4CL3P3CWEQ",
                                                    }*/
                                                    options.token = pushConfig.getPushConfig(tenant);
                                                    options["production"] = true;

                                                    let apnProvider = new apn.Provider(options);
                                                    let notification = new apn.Notification();
                                                    notification.title = username + " posted a comment.";
                                                    notification.body = comment;
                                                    notification.sound = "ping.aiff";

                                                    dbUtil.getConnection(function(db) {
                                                        var tableName = "T_PUSH_TENANTKEYS";
                                                        db.collection(tableName).find({
                                                            "tenant": tenant
                                                        }).toArray(function(err, result) {
                                                            console.log(result);
                                                            if (result.length == 0) {
                                                                res.json({
                                                                    "error": "tenant not found"
                                                                });
                                                            } else {
                                                                notification.topic = result[0].bundleId;
                                                                apnProvider.send(notification, iOSPushDevices).then((result) => {
                                                                    res.json({
                                                                        "success": "Notification sent"
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    });


                                                }
                                            }
                                        });
                                    });
                                    /*res.json({
                                        "success": "post liked"
                                    });*/
                                });
                            } else {
                                var cmntData = result[0];
                                cmntData.users.push({
                                    'un': username,
                                    'email': useremail,
                                    'img': userimage,
                                    'cmnt': comment,
                                    'date': date.toString()
                                });
                                db.collection(tableName).updateOne({
                                    "postId": postId
                                }, {
                                    $set: {
                                        "users": cmntData.users
                                    }
                                }, function(err, result3) {
                                    /*res.json({
                                        'success': 'comment posted'
                                    });*/
                                    dbUtil.getConnection(function(db) {
                                        var tableName = "T_" + tenant + "_" + channelId + "_DEVICES";
                                        console.log(tableName);
                                        db.collection(tableName).find({}, {
                                            _id: 0
                                        }).toArray(function(err, result) {
                                            //console.log("result"+result);
                                            if (result.length > 0) {
                                                console.log(result);

                                                for (var i = 0; i < result.length; i++) {
                                                    if (result[i].type == "iOS") {
                                                        deviceIOS.push(result[i].ID);
                                                    } else {
                                                        deviceAndroid.push(result[i].ID);
                                                    }

                                                }
                                                /*checking redundant ID from diff channels*/
                                                var iOSPushDevices = deviceIOS.filter(function(elem, index, self) {
                                                    return index == self.indexOf(elem);
                                                });
                                                var AndroidPushDevices = deviceAndroid.filter(function(elem, index, self) {
                                                    return index == self.indexOf(elem);
                                                });

                                                console.log("iOS devices" + iOSPushDevices);
                                                console.log("Android devices" + AndroidPushDevices);

                                                /* Send pushes to Android device */

                                                /* checking if devices are more than 1000 */
                                                if (false) {}
                                                /*if (AndroidPushDevices.length > 1000) {
                                                    var deviceGroup = [];
                                                    var AllDevices = [];
                                                    var devicesCount = 0;
                                                    for (var i = 0; i < AndroidPushDevices.length; i++) {

                                                        if (devicesCount == 1000) {
                                                            AllDevices.push(deviceGroup);
                                                            deviceGroup = [];
                                                            devicesCount = 0;
                                                            deviceGroup.push(AndroidPushDevices[i]);
                                                            devicesCount = devicesCount + 1;
                                                        } else {
                                                            deviceGroup.push(AndroidPushDevices[i]);
                                                            devicesCount = devicesCount + 1;
                                                        }
                                                    }
                                                    AllDevices.push(deviceGroup);
                                                    //console.log(AllDevices[1]);
                                                    var message = new gcm.Message();
                                                    message.addData('title', title);
                                                    message.addData('message', body);
                                                    message.addData('image', 'www/icon.png');
                                                    if (picture == "" || picture == null || picture == undefined) {} else {
                                                        message.addData('style', 'picture');
                                                        message.addData('picture', picture);
                                                        message.addData('summaryText', body);

                                                    }
                                                    message.addData('notId', parseInt(Math.random() * 10000));
                                                    message.addData('content-available', 1);

                                                    if (appletName == null || appletName == undefined) {} else {
                                                        message.addData("openApplet", appletName);
                                                    }

                                                    groupCount = 0;
                                                    sendGroupAndroidPushes(AllDevices, message, pushData, tenant);
                                                    //res.json(sendSuccess);*/
                                                else {
                                                    dbUtil.getConnection(function(db) {
                                                        var tableName = "T_PUSH_TENANTKEYS";
                                                        db.collection(tableName).find({
                                                            "tenant": tenant
                                                        }).toArray(function(err, result) {
                                                            console.log(result);
                                                            if (result.length == 0) {
                                                                res.json({
                                                                    "error": "tenant not found"
                                                                });
                                                            } else {
                                                                var apiKey = result[0].gcmKey
                                                                var service = new gcm.Sender(apiKey);
                                                                var message = new gcm.Message();
                                                                message.addData('title', username + " posted a comment.");
                                                                message.addData('message', comment);
                                                                message.addData('image', 'www/icon.png');
                                                                message.addData('notId', parseInt(Math.random() * 10000));
                                                                message.addData('content-available', 1);

                                                                if (appletName == null || appletName == undefined) {} else {
                                                                    message.addData("openApplet", appletName);
                                                                }
                                                                /*message.addData('actions', [
                                                                    { icon: "emailGuests", title: "EMAIL GUESTS", callback: "app.emailGuests"},
                                                                    { icon: "snooze", title: "SNOOZE", callback: "app.snooze"},
                                                                ]);*/

                                                                console.log(apiKey);

                                                                service.send(message, {
                                                                    registrationTokens: AndroidPushDevices
                                                                }, function(err, response) {
                                                                    if (err) {
                                                                        console.error(err + " " + response);
                                                                    } else { //console.log(response);

                                                                        res.json({
                                                                            "success": "Comment/Notification sent"
                                                                        });

                                                                    }
                                                                });
                                                            }
                                                        });
                                                    });


                                                }


                                                if (iOSPushDevices.length > 0) {
                                                    var options = {};
                                                    /*options.token = {
                                                        key: "./APNKey/APNSAuthKey_G8VD8LMAWQ.p8",
                                                        keyId: "G8VD8LMAWQ",
                                                        teamId: "4CL3P3CWEQ",
                                                    }*/
                                                    options.token = pushConfig.getPushConfig(tenant);
                                                    options["production"] = true;

                                                    let apnProvider = new apn.Provider(options);
                                                    let notification = new apn.Notification();
                                                    notification.title = username + " posted a comment.";
                                                    notification.body = comment;
                                                    notification.sound = "ping.aiff";

                                                    dbUtil.getConnection(function(db) {
                                                        var tableName = "T_PUSH_TENANTKEYS";
                                                        db.collection(tableName).find({
                                                            "tenant": tenant
                                                        }).toArray(function(err, result) {
                                                            console.log(result);
                                                            if (result.length == 0) {
                                                                res.json({
                                                                    "error": "tenant not found"
                                                                });
                                                            } else {
                                                                notification.topic = result[0].bundleId;
                                                                apnProvider.send(notification, iOSPushDevices).then((result) => {
                                                                    res.json({
                                                                        "success": "Notification sent"
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    });


                                                }

                                            }
                                        });
                                    });



                                });
                            }
                        });

                    });
                });
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}


exports.getPostComments = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.postId && req.body.channelId) {
        var tenant = req.body.tenant;
        var channelId = req.body.channelId;
        var postId = req.body.postId;

        var tableName = "T_" + tenant + "_" + channelId + "_POSTCOMMENTS";
        dbUtil.getConnection(function(db) {
            db.collection(tableName).find({
                'postId': postId
            }).toArray(function(err, result) {
                console.log(result);
                if (result.length > 0) {
                    res.json(result);
                } else {
                    res.json({
                        "error": "comment not found"
                    });
                }
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}

exports.deletePost = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.postId && req.body.channelId) {
        var tenant = req.body.tenant;
        var channelId = req.body.channelId;
        var postId = req.body.postId;

        //var tableName = "T_" + tenant + "_" + channelId + "_POSTCOMMENTS";
        var tableName = "T_" + tenant + "_FEED";
        dbUtil.getConnection(function(db) {
            db.collection(tableName).findOneAndDelete({
                'postId': postId
            },function(err, result) {
                if(result.value != null){
                if(result.value.postId == postId){
                        var tableName = "T_" + tenant + "_" + channelId + "_FEED";
                        db.collection(tableName).findOneAndDelete({
                            'postId': postId
                        },function(err, result) {
                            if(result.value != null){
                                if(result.value.postId == postId){
                                    res.json({"success":"post deleted"});
                                }
                            }
                            else{
                                res.json({
                                    "error": "post not found"
                                });
                            }
                        });
                        //res.json({"success":"post deleted"});
                    }
                else {
                    res.json({
                        "error": "post not found"
                    });
                    }
                }else{
                    res.json({
                        "error": "post not found"
                    });
                }
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}


exports.updatePost = function(req, res, next) {


    if (req.body && req.body.tenant && req.body.postId && req.body.channelId) {
        var tenant = req.body.tenant;
        var channelId = req.body.channelId;
        var postId = req.body.postId;

        var postContent = req.body;
        delete postContent._id;
        console.log(postContent);

        var tableName = "T_" + tenant + "_FEED";
        dbUtil.getConnection(function(db) {
            db.collection(tableName).replaceOne({
                'postId': postId
            },postContent,function(err, result) {
                console.log(result);
                if(result.result.ok == 1 && result.modifiedCount == 1){
                    var tableName = "T_" + tenant + "_" + channelId + "_FEED";
                        db.collection(tableName).replaceOne({
                            'postId': postId
                        },postContent,function(err, result) {
                            if(result.result.ok == 1 && result.modifiedCount == 1){
                            res.json({"success":"post updated"});
                            }else{
                             res.json({
                                    "error": "post not found"
                                });
                            }
                        });


                    }
                else {
                    res.json({
                        "error": "post not found"
                    });
                }
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}

exports.sendPushToUser = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.title && req.body.message && req.body.externaluserid) {
        var tenant = req.body.tenant;
        var title = req.body.title;
        var body = req.body.message;
        var externaluserid = req.body.externaluserid;
        var deviceIOS = [];
        var deviceAndroid = [];
        var picture = null;
        var appletName = null;

        dbUtil.getConnection(function(db) {
            var tableName = "T_" + tenant + "_all_DEVICES";
            console.log(tableName);
            var filterQuery = {"others" : {"userid" : externaluserid }};
            console.log(filterQuery);
            db.collection(tableName).find(filterQuery, {
                _id: 0
            }).toArray(function(err, result) {
                if (result.length > 0) {
                    //console.log(result);
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].type == "iOS") {
                            deviceIOS.push(result[i].ID);
                        } else {
                            deviceAndroid.push(result[i].ID);
                        }
                    }
                    /*checking redundant ID from diff channels*/
                    var iOSPushDevices = deviceIOS.filter(function(elem, index, self) {
                        return index == self.indexOf(elem);
                    });
                    var AndroidPushDevices = deviceAndroid.filter(function(elem, index, self) {
                        return index == self.indexOf(elem);
                    });

                    console.log("iOS devices" + iOSPushDevices);
                    console.log("Android devices" + AndroidPushDevices);

                    var tableName = "T_" + tenant + "_PUSHLOGS";
                    var data = {
                        'title': title,
                        'channel': null,
                        'body': body,
                        "userid" : externaluserid,
                        "status" : "D",  //D Delivered, V - viewed
                        'appleDevicesLogs': '',
                        'AndroidDevicesLogs': ''
                    };
                    db.collection(tableName).insertOne(data, function(err, result3) {
                        console.log(data);
                        var pushData = data;
                        var tableName = "T_PUSH_TENANTKEYS";
                        db.collection(tableName).find({
                            "tenant": tenant
                        }).toArray(function(err, tenantkeysresult) {
                            console.log(result);
                            if (tenantkeysresult.length == 0) {
                                res.json({
                                    "error": "tenant not found"
                                });
                            } else {

                                if(AndroidPushDevices.length > 0) {
                                  sendToAndroidDevices(title, body, tenant, AndroidPushDevices, tenantkeysresult[0], pushData);
                                }

                                if (iOSPushDevices.length > 0) {
                                    sendToIOSDevices(title, body, tenant, iOSPushDevices, tenantkeysresult[0], pushData);
                                }

                                res.json({
                                     "success": "Notification sent",
                                     "devices" : result
                                 });
                            }
                        });
                    });
                } else {
                    res.json({
                        "error": "No registered devices found."
                    });
                }
            });
        });

    }else {
        res.status(401).json({"Error":"Body should contain 'tenant', 'title', 'message' and 'externaluserid' "});
    }
}

var sendToAndroidDevices = function(title, body, tenant, AndroidPushDevices, tenantkeysresult, pushData) {
    var apiKey = tenantkeysresult.gcmKey
    var service = new gcm.Sender(apiKey);
    var message = new gcm.Message();
    message.addData('title', title);
    message.addData('message', body);
    message.addData('image', 'www/icon.png');
    message.addData('notId', parseInt(Math.random() * 10000));
    message.addData('content-available', 1);

    console.log(apiKey);

    service.send(message, {
        registrationTokens: AndroidPushDevices
    }, function(err, response) {
        if (err) {
            console.log("AK inside error");
            console.error(err + " " + response);
        } else { //console.log(response);
            pushData.AndroidDevicesLogs = response;
            // res.json({
            //     "success": "Notification sent"
            // });
            pushLogEntry(tenant, pushData);
        }
    });
}

var sendToIOSDevices = function(title, body, tenant, iOSPushDevices, pushData) {
      var options = {};
      /*options.token = {
          key: "./HostosAPNKey/APNsAuthKey_57ES993F74.p8",
          keyId: "57ES993F74",
          teamId: "99XMLGA57M"
      }*/
      options.token = pushConfig.getPushConfig(tenant);
      options["production"] = true;

      let apnProvider = new apn.Provider(options);
      let notification = new apn.Notification();
      notification.title = title;
      notification.body = body;
      notification.sound = "ping.aiff";
      var iOSBundleID;
      dbUtil.getConnection(function(db) {
          var tableName = "T_PUSH_TENANTKEYS";
          db.collection(tableName).find({
              "tenant": tenant
          }).toArray(function(err, result) {
              console.log(result);
              if (result.length == 0) {
                  // res.json({
                  //     "error": "tenant not found"
                  // });
              } else {
                  notification.topic = result[0].bundleId;
                  apnProvider.send(notification, iOSPushDevices).then((result) => {
                      // res.json({
                      //     "success": "Notification sent"
                      // });
                  });
              }
          });
      });
      console.log("Ios Push");
}


exports.updateDeviceToChannel = function(req, res, next) {
    if (req.body && req.body.id && req.body.tenant && req.body.type && req.body.channel) {

        var tenant = req.body.tenant;
        var ID = req.body.id;
        var type = req.body.type;
        var channel = req.body.channel;
        var others = (req.body.other == null || req.body.other == undefined) ? '' : req.body.other;

        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_" + channel + "_DEVICES";
                db.collection(tableName).find({
                    "ID": ID
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length > 0) {
                        var data = {
                            'ID': ID,
                            'type': type,
                            'channel': channel,
                            'others': others
                        };
                        db.collection(tableName).updateOne({
                            "ID": ID
                        }, {
                            $set: data
                        }, function(err, result3) {
                            res.json({
                                "success": "Device updated successfully"
                            });
                        });
                    } else {
                        res.json({
                            "error": "Device is not registered."
                        });
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}

exports.getUserNotifications = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.externaluserid) {
        var tenant = req.body.tenant;
        var userid = req.body.externaluserid;
        dbUtil.getConnection(function(db) {
            var tableName = "T_" + tenant + "_PUSHLOGS";
            db.collection(tableName).find({"userid" : userid}).toArray(function(err, result) {
                console.log(result);
                if (result.length > 0) {
                    res.json(result);
                } else {
                    res.json({
                        "error": "No logs found."
                    });
                }
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}

exports.updateUserNotificationStatus = function(req, res, next) {
    if (req.body && req.body.tenant && req.body._id) {
        var tenant = req.body.tenant;
        dbUtil.getConnection(function(db) {
            var tableName = "T_" + tenant + "_PUSHLOGS";
            if (!(req.body._id.match(/^[0-9a-fA-F]{24}$/))) {
              res.status(401).json({"Error":"Invalid Object Id "+id});
            }
            var id = new ObjectId(req.body._id);
            delete req.body._id;
            db.collection(tableName).updateOne({
                "_id": id
            }, {
                $set: {
                    'status': "V"
                }
            }, function(err, result3) {
                res.json({
                    "success": "data updated successfully"
                });
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}

exports.getUserNotificationsUnreadCount = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.externaluserid) {
        var tenant = req.body.tenant;
        var userid = req.body.externaluserid;
        dbUtil.getConnection(function(db) {
            var tableName = "T_" + tenant + "_PUSHLOGS";
            db.collection(tableName).count({"userid" : userid, "status" : {$ne : "V"} }, function(err, result) {
                console.log(result);
                res.json({
                    "count": result
                });
            });
        });
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}

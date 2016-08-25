var gcm = require('node-gcm');
var apn = require('apn');
var q = require('q');
var fs = require("fs");

var dbUtil = require("../../config/dbUtil");
var ObjectId = require('mongodb').ObjectID;


var apiKey = "AIzaSyB1BQYXqruGydpTRRtpMfVivrBlEzwR850";
//var apiKey = "AIzaSyCWE7t1KGMF8A8nmUBsri2QZD8ecxt8k-A";

exports.addAppleCert = function(req, res, next) {
    if (req.body && req.body.tenantID && req.body.tenant && req.body.cert && req.body.key) {

        var tenant = req.body.tenant;
        var tenantID = req.body.tenantID;
        var cert = req.body.cert;
        var key = req.body.key;

        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_PUSH_APPLEKEYS";
                db.collection(tableName).find({
                    "tenantID": tenantID
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length > 0) {
                        res.json({
                            "error": "Keys already registered."
                        });
                    } else {
                            //var cert=fs.readFileSync("cert.pem");
                            //var key=fs.readFileSync("key.pem");

                        var data = {
                            'tenant': tenant,
                            'tenantID': tenantID,
                            'cert': cert,
                            'key': key
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
            "Error": "Parameters missing tenant, tenantID, cert or key"
        });
    }
}


exports.updateAppleCert = function(req, res, next) {
    if (req.body && req.body.tenantID && req.body.tenant && req.body.cert && req.body.key) {

        var tenant = req.body.tenant;
        var tenantID = req.body.tenantID;
        var cert = req.body.cert;
        var key = req.body.key;

        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_PUSH_APPLEKEYS";
                db.collection(tableName).find({
                    "tenantID": tenantID
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length == 0) {
                        res.json({
                            "error": "tenant not found"
                        });
                    } else {
                        var data = {
                            'tenantID': tenantID,
                            'tenant': tenant,
                            'cert': cert,
                            'key': key
                        };
                        db.collection(tableName).updateOne({
                            "tenantID": tenantID
                        }, {
                            $set: data
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
            "Error": "Parameters missing tenantID, tenant, cert or key"
        });
    }
}


exports.getAppleCert = function(req, res, next) {
    if (req.body && req.body.tenantID && req.body.tenant && req.body.cert && req.body.key) {

        var tenant = req.body.tenant;
        var tenantID = req.body.tenantID;
        var cert = req.body.cert;
        var key = req.body.key;

        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_PUSH_APPLEKEYS";
                db.collection(tableName).find({
                    "tenantID": tenantID
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length == 0) {
                        res.json({
                            "error": "tenant not found"
                        });
                    } else {
                            res.json({
                                result
                            });
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
                            'others': others,
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

exports.getDevices = function(req, res, next) {
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
var sendGroupAndroidPushes = function(AllDevices, message) {
    //console.log(typeof groupCount);
    //console.log(AllDevices[groupCount]);

    var service = new gcm.Sender(apiKey);
    service.send(message, {
        registrationTokens: AllDevices[groupCount]
    }, function(err, response) {
        if (err) {
            groupCount = groupCount + 1;
            if (groupCount < AllDevices.length) {
                sendGroupAndroidPushes(AllDevices, message);
            }
        } else {

            groupCount = groupCount + 1;
            if (groupCount < AllDevices.length) {
                sendGroupAndroidPushes(AllDevices, message);
            } else {

                sendRes.json({
                            "success": "Notification sent"
                        });
            }
        }
    });
}


exports.sendPushToChannel = function(req, res, next) {

    if (req.body && req.body.tenant && req.body.channel && req.body.title && req.body.body) {
        sendRes=res;
        var tenant = req.body.tenant;
        var tenantID = req.body.tenantID;
        var channel = req.body.channel;
        var title = req.body.title;
        var body = req.body.body;
        var actions = req.body.actions;
        var addData = req.body.addData;
        var picture = req.body.picture;
        var appletName = req.body.appletName;
        var deviceType = req.body.deviceType;
        var deviceIOS = [];
        var deviceAndroid = [];


        /*if(deviceType == null || deviceType == undefined){
            query.channel={ $in: channel }
        }else{
            query.type=deviceType;
            query.channel={ $in: channel }
        }*/
        if (typeof channel == "string") {
            var query;
            query = channel;
        } else {
            var query = {};
            query.$in = channel;
        }

        //console.log(query);

        try {
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
                    //console.log(data);

                    var pushData = data;
                    var tableName = "T_" + tenant + "_DEVICES";
                    db.collection(tableName).find({
                        //db.things.find({ words: { $in: ["text", "here"] }});
                        "channel": query,

                    }).toArray(function(err, result) {
                        //console.log(result);
                        if (result.length > 0) {
                            for (var i = 0; i < result.length; i++) {
                                if (result[i].type == "iOS") {
                                    deviceIOS.push(result[i].ID);
                                } else {
                                    deviceAndroid.push(result[i].ID);
                                }
                            }
                            //console.log("iOS" + deviceIOS);
                            //console.log("Android" + deviceAndroid);
                            if (deviceAndroid.length > 0) {
                                if (deviceAndroid.length > 1000) {
                                    var deviceGroup = [];
                                    var AllDevices = [];
                                    var devicesCount = 0;
                                    for (var i = 0; i < deviceAndroid.length; i++) {

                                        if (devicesCount == 1000) {
                                            AllDevices.push(deviceGroup);
                                            deviceGroup = [];
                                            devicesCount = 0;
                                            deviceGroup.push(deviceAndroid[i]);
                                            devicesCount = devicesCount + 1;
                                        } else {
                                            deviceGroup.push(deviceAndroid[i]);
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
                                    sendGroupAndroidPushes(AllDevices, message);
                                    //res.json(sendSuccess);
                                } else {

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

                                    service.send(message, {
                                        registrationTokens: deviceAndroid
                                    }, function(err, response) {
                                        if (err) {
                                            console.error(err);
                                        } else { //console.log(response); 
                                            pushData.AndroidDevicesLogs=response;
                                            res.json({
                                                "success": "Notification sent"
                                            });
                                            pushLogEntry(tenant, pushData);
                                        }
                                    });
                                }
                            }


                            //console.log(deviceIOS);
                            if (deviceIOS.length > 0) {
                                var options = {};
                                options["production"] = true;
                                dbUtil.getConnection(function(db) {
                                var tableName = "T_PUSH_APPLEKEYS";
                                db.collection(tableName).find({
                                "tenantID": tenantID
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

                                //var certBuffer=fs.readFileSync("cert.pem");
                                //var keyBuffer=fs.readFileSync("key.pem");
                                    //options["cert"] = certBuffer;
                                    //options["key"] = keyBuffer;

                                var iOSTokens = [];
                                var apnConnection = new apn.Connection(options)

                                for (var i = 0; i < deviceIOS.length; i++) {
                                    var myDevice = new apn.Device(deviceIOS[i]);
                                    iOSTokens.push(myDevice);
                                }
                                //var myDevice = new apn.Device(id);

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
                                //note.payload = {'title': 'Push title1','messageFrom': 'Caroline'};

                                apnConnection.pushNotification(note, iOSTokens);
                                var iOSPushes=[];

                                apnConnection.on("transmitted", function(notification, device) {
                                    iOSPushes.push(device.token.toString("hex"));
                                });

                                apnConnection.on("completed", function(notification, device) {
                                    console.log(iOSPushes);
                                    pushData.appleDevicesLogs=iOSPushes;
                                    pushLogEntry(tenant, pushData);
                                });

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
                                var tableName = "T_PUSH_APPLEKEYS";
                                db.collection(tableName).find({
                                "tenantID": tenantID
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


exports.deleteDevice = function(req, res, next) {
    if (req.body && req.body.id && req.body.tenant) {

        var tenant = req.body.tenant;
        var ID = req.body.id;

        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_DEVICES";
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
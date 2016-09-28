var gcm = require('node-gcm');
var apn = require('apn');
var q = require('q');
var fs = require("fs");

var dbUtil = require("../../config/dbUtil");
var ObjectId = require('mongodb').ObjectID;


exports.addTenantPushKeys = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.cert && req.body.key) {

        var tenant = req.body.tenant;
        var cert = req.body.cert;
        var key = req.body.key;
        var gcmKey = req.body.gcmKey;
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
                        var key = fs.readFileSync("key.pem");

                        console.log(cert);

                        var data = {
                            'tenant': tenant,
                            'cert': cert,
                            'key': key,
                            'gcmKey': gcmKey
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
            "Error": "Parameters missing tenant, cert or key"
        });
    }
}


exports.updateTenantPushKeys = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.cert && req.body.key) {

        var tenant = req.body.tenant;
        var cert = req.body.cert;
        var key = req.body.key;
        var gcmKey = req.body.gcmKey;
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
                            'cert': cert,
                            'key': key,
                            'gcmKey': gcmKey
                        };
                        db.collection(tableName).updateOne({
                            "tenant": tenant
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
            "Error": "Parameters missing, tenant, cert or key"
        });
    }
}


exports.getTenantPushKeys = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.cert && req.body.key) {

        var tenant = req.body.tenant;
        var cert = req.body.cert;
        var key = req.body.key;
        var gcmKey = req.body.gcmKey
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
                                        db.collection(tableName).find({}, {
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

                                                        //var certBuffer=fs.readFileSync("cert.pem");
                                                        //var keyBuffer=fs.readFileSync("key.pem");
                                                        //options["cert"] = certBuffer;
                                                        //options["key"] = keyBuffer;

                                                        var iOSTokens = [];
                                                        var apnConnection = new apn.Connection(options)

                                                        for (var i = 0; i < iOSPushDevices.length; i++) {
                                                            var myDevice = new apn.Device(iOSPushDevices[i]);
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
                                                        var iOSPushes = [];

                                                        apnConnection.on("transmitted", function(notification, device) {
                                                            iOSPushes.push(device.token.toString("hex"));
                                                        });

                                                        apnConnection.on("completed", function(notification, device) {
                                                            console.log(iOSPushes);
                                                            pushData.appleDevicesLogs = iOSPushes;
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




                                                }
                                            } else {

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
        dbUtil.getConnection(function(db) {
            var tableName = "T_" + tenant + "_FEED";
            db.collection(tableName).find().sort({
                _id: -1
            }).toArray(function(err, result) {
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


exports.getTenantChannelFeed = function(req, res, next) {
    if (req.body && req.body.tenant && req.body.channelId) {
        var tenant = req.body.tenant;
        var channelId = req.body.channelId;
        dbUtil.getConnection(function(db) {
            var tableName = "T_" + tenant + "_" + channelId + "_FEED";
            db.collection(tableName).find().sort({
                _id: -1
            }).toArray(function(err, result) {
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
                var data = result[0];
                if (data.likes == '') {
                    data.likes = 1;
                } else {
                    data.likes = data.likes + 1;
                }
                db.collection(tableName).updateOne({
                    "postId": postId
                }, {
                    $set: data
                }, function(err, result3) {
                    var tableName = "T_" + tenant + "_" + channelId + "_FEED";
                    db.collection(tableName).updateOne({
                        "postId": postId
                    }, {
                        $set: data
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
                                            var data = result[0];
                                            data.posts.push(postId);
                                            db.collection(tableName).updateOne({
                                                "email": useremail
                                            }, {
                                                $set: data
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
                                var likeData = result[0];
                                likeData.users.push({
                                    'un': username,
                                    'email': useremail,
                                    'img': userimg
                                });
                                db.collection(tableName).updateOne({
                                    "postId": postId
                                }, {
                                    $set: likeData
                                }, function(err, result3) {
                                    var tableName = "T_" + tenant + "_USERLIKEDPOSTS";
                                    db.collection(tableName).find({
                                        "email": useremail
                                    }).toArray(function(err, result) {
                                        console.log(result);
                                        if (result.length > 0) {
                                            var data = result[0];
                                            data.posts.push(postId);
                                            db.collection(tableName).updateOne({
                                                "email": useremail
                                            }, {
                                                $set: data
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
                var data = result[0];
                if (data.likes == '') {} else {
                    data.likes = data.likes - 1;
                }
                db.collection(tableName).updateOne({
                    "postId": postId
                }, {
                    $set: data
                }, function(err, result3) {
                    var tableName = "T_" + tenant + "_" + channelId + "_FEED";
                    db.collection(tableName).updateOne({
                        "postId": postId
                    }, {
                        $set: data
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
                                $set: likeData
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
                                            $set: data
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
                console.log(result);
                if (result.length > 0) {
                    var views = result[0].views;
                    console.log(result[0]);
                    console.log(views);
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
                        $set: {"views":views}
                    }, function(err, result3) {
                        console.log("err"+err);
                        console.log("result3"+result3);
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
        var appletName="Home4";
        dbUtil.getConnection(function(db) {
                var tableName = "T_" + tenant + "_FEED";
                db.collection(tableName).find({
                    "postId": postId
                }).toArray(function(err, result) {
                        //console.log(result);
                        var data = result[0];
                        if (data.cmnts == '') {
                            data.cmnts = 1;
                        } else {
                            data.cmnts = data.cmnts + 1;
                        }
                        db.collection(tableName).updateOne({
                                "postId": postId
                            }, {
                                $set: data
                            }, function(err, result3) {
                                var tableName = "T_" + tenant + "_" + channelId + "_FEED";
                                db.collection(tableName).updateOne({
                                        "postId": postId
                                    }, {
                                        $set: data
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

                                                                                //var certBuffer=fs.readFileSync("cert.pem");
                                                                                //var keyBuffer=fs.readFileSync("key.pem");
                                                                                //options["cert"] = certBuffer;
                                                                                //options["key"] = keyBuffer;

                                                                                var iOSTokens = [];
                                                                                var apnConnection = new apn.Connection(options)

                                                                                for (var i = 0; i < iOSPushDevices.length; i++) {
                                                                                    var myDevice = new apn.Device(iOSPushDevices[i]);
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
                                                                                var iOSPushes = [];

                                                                                /*apnConnection.on("transmitted", function(notification, device) {
                                                                                    iOSPushes.push(device.token.toString("hex"));
                                                                                });

                                                                                apnConnection.on("completed", function(notification, device) {
                                                                                    console.log(iOSPushes);
                                                                                    pushData.appleDevicesLogs = iOSPushes;
                                                                                    pushLogEntry(tenant, pushData);
                                                                                });*/

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
                                                    $set: cmntData
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

                                                                                //var certBuffer=fs.readFileSync("cert.pem");
                                                                                //var keyBuffer=fs.readFileSync("key.pem");
                                                                                //options["cert"] = certBuffer;
                                                                                //options["key"] = keyBuffer;

                                                                                var iOSTokens = [];
                                                                                var apnConnection = new apn.Connection(options)

                                                                                for (var i = 0; i < iOSPushDevices.length; i++) {
                                                                                    var myDevice = new apn.Device(iOSPushDevices[i]);
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
                                                                                var iOSPushes = [];

                                                                                /*apnConnection.on("transmitted", function(notification, device) {
                                                                                    iOSPushes.push(device.token.toString("hex"));
                                                                                });

                                                                                apnConnection.on("completed", function(notification, device) {
                                                                                    console.log(iOSPushes);
                                                                                    pushData.appleDevicesLogs = iOSPushes;
                                                                                    pushLogEntry(tenant, pushData);
                                                                                });*/

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
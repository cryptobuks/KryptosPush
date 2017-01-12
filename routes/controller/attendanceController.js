"use strict";
var gcm = require('node-gcm');
var apn = require('apn');
var q = require('q');
var fs = require("fs");
var jsonfile = require('jsonfile');
var excelbuilder = require('msexcel-builder');

var dbUtil = require("../../config/dbUtil");
var ObjectId = require('mongodb').ObjectID;

var weekday = new Array(7);
weekday[0] = "Monday";
weekday[1] = "Tuesday";
weekday[2] = "Wednesday";
weekday[3] = "Thursday";
weekday[4] = "Friday";
weekday[5] = "Saturday";
weekday[6] = "Sunday";

exports.getClassDetail = function(req, res, next) {
    if (req.body && req.body.qrCode) {

        var qrID = req.body.qrCode
        try {

            var file = './QrTimeTables/' + qrID + '.json';
            jsonfile.readFile(file, function(err, timetable) {
                if (err == null) {
                    var d = new Date();
                    var currentDay = weekday[d.getDay()-1];
                    var currentClasses = timetable[currentDay];
                    console.log(currentDay+" "+currentClasses);
                    var classFound = false;
                    for (var i = 0; i < currentClasses.length; i++) {
                        //console.log(i);
                        var classTime = currentClasses[i].time.replace(/ /, "").split("-");
                        var classSTTime = classTime[0];
                        var classETTime = classTime[1];
                        //console.log(classSTTime);console.log(classETTime);
                        var currentTmInMin = d.getHours() * 60 + d.getMinutes();
                        var classSTTimeInMin = parseInt(classSTTime.split(":")[0]) * 60 + parseInt(classSTTime.split(":")[1])
                        var classETTimeInMin = parseInt(classETTime.split(":")[0]) * 60 + parseInt(classETTime.split(":")[1])
                            //console.log(currentTmInMin+" "+classSTTimeInMin+" "+classETTimeInMin);
                        if (currentTmInMin >= classSTTimeInMin && currentTmInMin <= classETTimeInMin) {
                            //console.log(true);
                            currentClasses[i].qrID = qrID;
                            classFound = true;
                            var currentClassData = currentClasses[i];
                        }
                    }
                    if (!classFound) {
                        res.json({
                            "Error": "No class found at this time."
                        });
                    } else {
                        res.json(currentClassData);
                    }
                } else {
                    res.json({
                        "Error": "Unable to read timetable."
                    });
                }

            });
        } catch (e) {
            res.json({
                "Error": "Unable to read timetable."
            });
        }
    } else {
        res.status(401).json({
            "Error": "Parameters missing"
        });
    }
}


exports.markUserAttendance = function(req, res, next) {
    if (req.body && req.body.qrCode && req.body.faculty && req.body.classTime && req.body.stuName && req.body.className && req.body.subject && req.body.year && req.body.rollNo) {

        var qrCode = req.body.qrCode;
        var faculty = req.body.faculty;
        var classTime = req.body.classTime;
        var stuName = req.body.stuName;
        var className = req.body.className;
        var subject = req.body.subject;
        var year = req.body.year;
        var rollNo = req.body.rollNo;
        var today = new Date();
        var stuTime = (today.getHours() + ":" + today.getMinutes()).toString();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var date = dd + '/' + mm + '/' + yyyy;

        try {
            dbUtil.getConnection(function(db) {
                var tableName = "T_" + year + "_" + className + "_" + subject;
                db.collection(tableName).find({
                    "date": date,
                    "rollNo": rollNo
                }).toArray(function(err, result) {
                    console.log(result);
                    if (result.length > 0) {
                        var StudentMarkedAttendance = false;
                        console.log(classTm);
                        var classTm = classTime.replace(/ /, "").split("-");
                        var classSTTime = classTm[0];
                        var classETTime = classTm[1];
                        var classSTTimeInMin = parseInt(classSTTime.split(":")[0]) * 60 + parseInt(classSTTime.split(":")[1])
                        var classETTimeInMin = parseInt(classETTime.split(":")[0]) * 60 + parseInt(classETTime.split(":")[1])

                        for (var i = 0; i < result.length; i++) {
                            var stuClassTime = result[i].stuTime;

                            var StuTimeInMin = parseInt(stuClassTime.split(":")[0]) * 60 + parseInt(stuClassTime.split(":")[1])


                            if (StuTimeInMin >= classSTTimeInMin && StuTimeInMin <= classETTimeInMin) {
                                res.json({
                                    "error": "You have already marked the attendance"
                                });
                                break;
                            } else {
                                StudentMarkedAttendance = true;
                            }
                        }
                        if (StudentMarkedAttendance) {
                            var data = {
                                'qrCode': qrCode,
                                'faculty': faculty,
                                'classTime': classTime,
                                'stuName': stuName,
                                'className': className,
                                'subject': subject,
                                'year': year,
                                'rollNo': rollNo,
                                'stuTime': stuTime,
                                'date': date
                            };
                            db.collection(tableName).insertOne(data, function(err, result3) {
                                if (!err) {
                                    res.json({
                                        "success": "Attendance marked"
                                    });
                                }
                            });
                        }
                    } else {
                        var data = {
                            'qrCode': qrCode,
                            'faculty': faculty,
                            'classTime': classTime,
                            'stuName': stuName,
                            'className': className,
                            'subject': subject,
                            'year': year,
                            'rollNo': rollNo,
                            'stuTime': stuTime,
                            'date': date
                        };
                        db.collection(tableName).insertOne(data, function(err, result3) {
                            if (!err) {
                                res.json({
                                    "success": "Attendance marked"
                                });
                            }
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


exports.createExcel = function(req, res, next) {
    // Create a new workbook file in current working-path
    if (req.body && req.body.year && req.body.className && req.body.subject) {
        var year = req.body.year;
        var className = req.body.className;
        var subject = req.body.subject;

        var tableName = "T_" + year + "_" + className + "_" + subject;
        var workbook = excelbuilder.createWorkbook('./', tableName + '_StudentAttendance.xlsx')

        // Create a new worksheet with 10 columns and 12 rows

        // Fill some data

        dbUtil.getConnection(function(db) {
            var tableName = "T_" + year + "_" + className + "_" + subject;
            db.collection(tableName).find({}).toArray(function(err, result) {
                console.log(result);
                if (result.length > 0) {
                    var sheet1 = workbook.createSheet('StudentsAttendance', 10, result.length+2);
                    sheet1.set(1, 1, "Date");
                    sheet1.font(1, 1, {
                        "name": "Cambria (Headings)",
                        "sz": "12",
                        "bold": "true"
                    });
                    sheet1.font(2, 1, {
                        "name": "Cambria (Headings)",
                        "sz": "12",
                        "bold": "true"
                    });
                    sheet1.font(3, 1, {
                        "name": "Cambria (Headings)",
                        "sz": "12",
                        "bold": "true"
                    });
                    sheet1.font(4, 1, {
                        "name": "Cambria (Headings)",
                        "sz": "12",
                        "bold": "true"
                    });
                    sheet1.font(5, 1, {
                        "name": "Cambria (Headings)",
                        "sz": "12",
                        "bold": "true"
                    });
                    sheet1.font(6, 1, {
                        "name": "Cambria (Headings)",
                        "sz": "12",
                        "bold": "true"
                    });
                    sheet1.font(7, 1, {
                        "name": "Cambria (Headings)",
                        "sz": "12",
                        "bold": "true"
                    });
                    sheet1.font(8, 1, {
                        "name": "Cambria (Headings)",
                        "sz": "12",
                        "bold": "true"
                    });

                    sheet1.set(2, 1, "Student Name");
                    sheet1.set(3, 1, "Roll No");
                    sheet1.set(4, 1, "Class");
                    sheet1.set(5, 1, "Subject");
                    sheet1.set(6, 1, "Year");
                    sheet1.set(7, 1, "Faculty");
                    sheet1.set(8, 1, "Student Time");


                    for (var i = 0; i < result.length; i++) {
                        try {
                            console.log(result[i].date);
                            sheet1.set(1, i + 2, result[i].date);
                            sheet1.set(2, i + 2, result[i].stuName);
                            sheet1.set(3, i + 2, result[i].rollNo);
                            sheet1.set(4, i + 2, result[i].className);
                            sheet1.set(5, i + 2, result[i].subject);
                            sheet1.set(6, i + 2, result[i].year);
                            sheet1.set(7, i + 2, result[i].faculty);
                            sheet1.set(8, i + 2, result[i].stuTime);
                        } catch (e) {}
                        }
                        // Save it

                            workbook.save(function(err) {
                        if (err){
                            res.send(err);
                        }
                        else {
                            console.log("sheet created");
                            res.send({'success':'sheet created'});
                        }

                        });
                    
                } else {
                    res.send({
                        "Error": "No attendance data found."
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
var express = require('express');
var compareJSON = require('json-structure-validator');

var router = express.Router();
var _ = require('lodash');
var metaDataStructure = {
    "clientId": "",
    "appId": "",
    "featureId": "",
    "subFeature": "",
    "metaData": ""
}

var metaDataStructureWithId = _.extend({"_id": ""}, metaDataStructure);

/**
 * To Validate the structure of the JSON file being sent from the client side.
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var canProcessMetaDataPost = function (req, res, next) {
    var comparison = compareJSON(req.body, metaDataStructure);
    var result = "Valid Request"
    if (comparison != true) {
        comparison = compareJSON(req.body, metaDataStructureWithId);
    }
    if (comparison != true) {
        result = comparison;
        res.status(401).send(result);
    } else {
        next();
    }
}

var pushPluginController = require("../routes/controller/pushController");

router.route("/push/addAppleCert")
    .post(pushPluginController.addAppleCert);
router.route("/push/updateAppleCert")
    .post(pushPluginController.updateAppleCert);
router.route("/push/getAppleCert")
    .post(pushPluginController.getAppleCert);
router.route("/push/adddevice")
    .post(pushPluginController.adddevice);

router.route("/push/adddeviceToChannel")
    .post(pushPluginController.adddeviceToChannel);

router.route("/push/updateDevice")
    .post(pushPluginController.updateDevice);
router.route("/push/getAllDevices")
    .post(pushPluginController.getAllDevices);

router.route("/push/getChannelDevices")
    .post(pushPluginController.getChannelDevices);

router.route("/push/sendPushToChannel")
    .post(pushPluginController.sendPushToChannel);
    
router.route("/push/sendPushToDevice")
    .post(pushPluginController.sendPushToDevice);
router.route("/push/getPushLogs")
    .post(pushPluginController.getPushLogs);

router.route("/push/getTenantFeed")
    .post(pushPluginController.getTenantFeed);

router.route("/push/getTenantChannelFeed")
    .post(pushPluginController.getTenantChannelFeed);
    
router.route("/push/deleteDeviceFromChannel")
    .post(pushPluginController.deleteDeviceFromChannel);

router.route("/push/createChannel")
    .post(pushPluginController.createChannel);

router.route("/push/getChannels")
    .post(pushPluginController.getChannels);


module.exports = router;
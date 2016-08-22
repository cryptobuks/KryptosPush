var createMetaData = function(db, callback) {
   db.collection('MetaData').insertOne( {
      "clientId":1,
      "appId" :1,
      "featureId":1,
      "subFeature":'Table1',
      "metadata" : [
            {"key":"menuItem","label":"Menu Item","dataType":"String"},
            {"key":"category","label":"Category","dataType":"String"},
            {"key":"price","label":"Price","dataType":"Number"}
      ]
   }, function(err, result) {
    console.log("Inserted a document into the MetaData collection.");
    callback(result);
  });
};

module.exports.createMetaData = createMetaData;
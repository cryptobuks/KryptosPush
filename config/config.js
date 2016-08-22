module.exports ={
	mongoUrl : process.env.MONGO_URL || "mongodb://localhost:27017/kryptosmobile",
	//mongoUrl : process.env.MONGO_URL || "mongodb://kryptos:kryptos@dbh35.mongolab.com:27357/kryptos",
	api : [
			{apiName:"createMetaData", type: "POST", urlPattern:"/api/createMetaData", sampleRequest:"{clientId:'',appId:'',fetureId:'',subFeature:'',metaData:[{ key : '', label : '', dataType : '' }]}"},
			{apiName:"queryTenantMetaData", type: "GET", urlPattern:"/api/queryTenantMetaData/:clientId/:appId/:featureId?subFeature=[subFeatureName]", sampleRequest:"{Nothing in request body}"},
			{apiName:"createTenantData", type: "POST", urlPattern:"/api/createMetaData/:clientId/:appId/:featureId?subFeature=[subFeatureName]", sampleRequest:"{depends on the metadata keys provided for createMetaData operation}"},
			{apiName:"queryTenantData", type: "POST", urlPattern:"/api/queryTenantMetaData/:clientId/:appId/:featureId?subFeature=[subFeatureName]", sampleRequest:"{Mongodb style query eg {'_id':'theIdOfTheField'}}"},
			{apiName:"imageUpload", type: "POST", urlPattern:"/api/imageUpload", sampleRequest:"{imageData:'base64encodeimagedata',imageExtn:'png/jpeg'}"}

		 ]
}
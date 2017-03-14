module.exports.getPushConfig = function(tenantid) {

	if(tenantid == 'HOSTOS') {
		return {
          key: "./HostosAPNKey/APNsAuthKey_57ES993F74.p8",
          keyId: "57ES993F74",
          teamId: "99XMLGA57M"
      	};
	}else {
		return {
			key: "./APNKey/APNSAuthKey_G8VD8LMAWQ.p8",
            keyId: "G8VD8LMAWQ",
            teamId: "4CL3P3CWEQ",
        };
	}
}
module.exports.getPushConfig = function(tenantid) {

	if(tenantid == 'HOSTOS') {
		return {
          key: "./HostosAPNKey/APNsAuthKey_57ES993F74.p8",
          keyId: "57ES993F74",
          teamId: "99XMLGA57M"
      	};
	}
  else if(tenantid == 'RMC') {
    return {
          key: "./RMCAPNKey/APNsAuthKey_P56AJ4356Q.p8",
          keyId: "P56AJ4356Q",
          teamId: "GLW9XZQZ5L"
        };
  }
  else if(tenantid == 'SWTCC') {
    return {
          key: "./SWTCCAPNKey/APNsAuthKey_S6WH9R7SAN.p8",
          keyId: "S6WH9R7SAN",
          teamId: "7WGT8EDNZ7"
        };
  }

  else if(tenantid == 'Becker') {
    return {
          key: "./BeckerAPNKey/APNsAuthKey_T8LTJ6DKL3.p8",
          keyId: "T8LTJ6DKL3",
          teamId: "8ZY6ZVBR99"
        };
  }
  else if(tenantid == 'KBCC') {
    return {
          key: "./KBCCAPNKey/APNsAuthKey_3KR3B3U94S.p8",
          keyId: "3KR3B3U94S",
          teamId: "ST67VWJNP5"
        };
  }
  else {
		return {
			key: "./APNKey/APNSAuthKey_G8VD8LMAWQ.p8",
            keyId: "G8VD8LMAWQ",
            teamId: "4CL3P3CWEQ",
        };
	}
}
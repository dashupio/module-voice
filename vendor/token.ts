// require dependencies
const RtcTokenBuilder = require('./src/RtcTokenBuilder').RtcTokenBuilder;
const RtcRole = require('./src/RtcTokenBuilder').Role;

// expiration time
const expirationTimeInSeconds = 3600;

// generate
const generate = ({
  appID,
  appCertificate,

  uid,
  channel,
}) => {
  // create expiry
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // role
  const role = RtcRole.PUBLISHER; 

  // create token
  return RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channel, uid, role, privilegeExpiredTs);
};

// export
export default generate;
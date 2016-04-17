var request = require('request');
var req = request.defaults();
var fs = require('fs');

var data = JSON.stringify(
{
  "acquirerCountryCode": "840",
  "acquiringBin": "408999",
  "primaryAccountNumber": "4957030420210512",
  "retrievalReferenceNumber": "330000550000",
  "systemsTraceAuditNumber": "451006"
}
);

var userId = 'QJUI3JU0W767AC7HGV6O21RfUVJUd1EwdTix4YEMGAuvztgbo';
var password = 'VwYHk3OtSLNmFYAhmCK5';
var keyFile = 'certificates/key_bolt2.pem';
var certificateFile ='certificates/cert.pem';

req.post({
    uri : "https://sandbox.api.visa.com/paai/fundstransferattinq/v1/cardattributes/fundstransferinquiry",
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certificateFile),
    headers: {
      'Content-Type' : 'application/json',
      'Accept' : 'application/json',
      'Authorization' : 'Basic ' + new Buffer(userId + ':' + password).toString('base64')
    },
    body: data
  }, function(error, response, body) {
    if (!error) {
      console.log("Response Code: " + response.statusCode);
      console.log("Headers:");
      for(var item in response.headers) {
        console.log(item + ": " + response.headers[item]);
      }
      console.log("Body: "+ body);
    } else {
      console.log("Got error: " + error.message);
    }
  }
);
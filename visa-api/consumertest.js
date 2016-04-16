var request = require('request');
var req = request.defaults();
var fs = require('fs');

var data = JSON.stringify({
    "primaryAccountNumber": "4928619425321010"
});

var userId = '1JU5YLFNJP0ISHOWB4RL21rjbOfWnkbbE09d06EKCMQcIVcQs';
var password = 'BBlUAZ1kcNEYZFB738K6Z';
var keyFile = 'certificates/key_Bolt.pem';
var certificateFile ='certificates/cert.pem';

req.post({
    uri : "https://sandbox.api.visa.com/vctc/customerrules/v1/consumertransactioncontrols",
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
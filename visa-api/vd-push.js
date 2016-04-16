var request = require('request');
var req = request.defaults();
var fs = require('fs');

var data = JSON.stringify({
  "systemsTraceAuditNumber":"451000",
  "retrievalReferenceNumber":"330000550000",
  "localTransactionDateTime":"2016-04-16T18:56:11",
  "acquiringBin":"408999",
  "acquirerCountryCode":"840",
  "senderAccountNumber":"4957030420210454",
  "recipientPrimaryAccountNumber":"4957030420210462",
  "cardAcceptor": {
    "address":{
      "country":"USA",
      "state":"CA",
      "zipCode":"33196"
    },
    "name":"Acceptor 1",
    "terminalId":"365539",
    "idCode":"VMT200911026070"
  },
  "amount":"350",
  "transactionCurrencyCode": "USD",
  "businessApplicationId":"AA",
  "recipientName": "rohan"
});

var userId = 'QJUI3JU0W767AC7HGV6O21RfUVJUd1EwdTix4YEMGAuvztgbo';
var password = 'VwYHk3OtSLNmFYAhmCK5';
var keyFile = 'certificates/key_bolt2.pem';
var certificateFile ='certificates/cert.pem';

req.post({
    uri : "https://sandbox.api.visa.com/visadirect/fundstransfer/v1/pushfundstransactions",
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
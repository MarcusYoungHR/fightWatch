var FetchStream = require("fetch").FetchStream;
// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Set the Region
AWS.config.loadFromPath('./config.json');

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// call S3 to retrieve upload file to specified bucket
const s3Uploader = function(url, name) {
  var uploadParams = {Bucket: 'fightwatchimages', Key: '', Body: ''};

  var fileStream = new FetchStream(url));

  uploadParams.Body = fileStream;
  var path = require('path');

  uploadParams.Key = transponseImgName(name)

  // call S3 to retrieve upload file to specified bucket
  s3.upload (uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } if (data) {
      console.log("Upload Success", data.Location);
    }
  });
}

s3Uploader('./Tyson.jpg')

// var fetch = new FetchStream("https://www.sherdog.com/image_crop/200/300/_images/fighter/20150523042239_5D3_3889.JPG");

// fetch.on("data", function(chunk){
//   console.log('rectum sex \n', chunk);
// });

// console.log('---------------------------------------------------------------------------------------------------------------')




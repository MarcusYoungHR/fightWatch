// Load the SDK for JavaScript
var FetchStream = require("fetch").FetchStream;
var AWS = require('aws-sdk');
const {transposeImgName} = require('./utils.js')
// Set the Region
AWS.config.loadFromPath(process.cwd() + '/server/config.json');

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// call S3 to retrieve upload file to specified bucket

const s3Uploader = function(url, name, callback, errorCB) {
  var uploadParams = {Bucket: 'fightwatchimages', Key: '', Body: '', ACL: 'public-read'};

  var fileStream = new FetchStream(url);

  fileStream.on('error', (err)=> {
    console.log('error in s3upload \n', err)
    errorCB()
  })

  uploadParams.Body = fileStream;
  var path = require('path');

  uploadParams.Key = transposeImgName(name)

  // call S3 to retrieve upload file to specified bucket
  s3.upload (uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } if (data) {
      console.log("Image Upload Success", data.Location);
      callback()
    }
  });
}

module.exports = {
  s3Uploader
}
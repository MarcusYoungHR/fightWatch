var fs = require('fs')
var request = require('request');

var downloadImg = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

const transposeName = function (name) { //helper function to tranpose names so they are google searchable
  var transposed = name.replace(/ /g, '+');
  return transposed;
}

const transposeImgName = function (name) { //helper function to tranpose names so they are google searchable
  var transposed = name.replace(/ /g, '-') + '.jpg';
  return transposed;
}

const capitalizeWords = function (str) {
  return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

module.exports = {
  downloadImg,
  transposeName,
  capitalizeWords,
  transposeImgName
}
// example:
// download('https://www.sherdog.com/image_crop/200/300/_images/fighter/20150929010143_1MG_2010.JPG', 'google.png', function(){
//   console.log('done');
// });


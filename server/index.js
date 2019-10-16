var express = require('express');
var bodyParser = require('body-parser');
const request = require('request');
// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
// var items = require('../database-mysql');
// var items = require('../database-mongo');

var app = express();
app.use(bodyParser());
// UNCOMMENT FOR REACT
app.use(express.static(__dirname + '/../react-client/dist'));

// UNCOMMENT FOR ANGULAR
// app.use(express.static(__dirname + '/../angular-client'));
// app.use(express.static(__dirname + '/../node_modules'));



app.listen(3000, function () {
  console.log('listening on port 3000!');
});

var thisIsBadCode = function(text, name) {
  var obj = {
    foundName: false,
    foundDate: false,
    title: '',
    date: ''
  }
  var index = text.indexOf(name);
  let i = index;
  while(text[i] !== '|') {
    obj.title += text[i];
    i ++;
  }
  i ++;
  while(text[i] !== ']') {
    obj.date += text[i];
    i ++;
  }
  console.log(obj.title, '\n', obj.date);
}

app.get('/search', function (req, res) {

  var url = "https://en.wikipedia.org/w/api.php";
  var fighter = req.query.fighter;
  console.log(fighter);
  var params = {
    action: "parse",
    page: fighter,
    format: "json",
    section: 20,
    prop: 'wikitext'
  };

  url = url + "?origin=*";
  Object.keys(params).forEach(function (key) { url += "&" + key + "=" + params[key]; });
  //console.log(url);
  request(url, function(err, response, body) {
     var obj = JSON.parse(body);
     console.log(obj);
     //thisIsBadCode(obj.parse.wikitext['*'], fighter);
     res.send(obj.parse.text);
  })

});

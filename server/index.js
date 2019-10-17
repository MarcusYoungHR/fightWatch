var express = require('express');
var bodyParser = require('body-parser');
const request = require('request');
var sherdog = require('sherdog');
const {insertFighter, getFighters, removeFighter} = require('../database-mysql/index.js')
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

//const url = 'https://www.sherdog.com/fighter/Colby-Covington-57269'

var transposeName = function(name) {
  var butt = name.replace(/ /g, '+');
  return butt;
}

app.get('/search', function (req, res) {
  
  sherdog.getFighter(req.query.fighter, function(data) {
    insertFighter(data).then((data) => {
      res.end()
    });
  })
});

app.get('/load', function(req, res) {

  getFighters().then(function(data) {
    res.send(data);
  })
})

app.delete('/search', function(req, res) {
  removeFighter(req.body.fighter).then(()=> {
    res.end();
  })
})

app.get('/test', function(req, res) {
  request('https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:xatgqbhqag0&q=sherdog+stipe+miocic', function(err, res, body) {
    console.log('body********************************************************************************* \n', JSON.parse(body).items);
  })
})
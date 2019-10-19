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


/*
  sherdog.getFighter(req.query.fighter, function(data) {
    insertFighter(data).then((data) => {
      res.end()
    });
  })
*/
app.get('/search', function (req, res) {
  var string = transposeName(req.query.fighter);
  request(`https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:xatgqbhqag0&q=${string}`, function(err, response, body) {
    var url = JSON.parse(body).items[0].link;
    sherdog.getFighter(url, function(data) {
      insertFighter(data).then((data) => {
        res.end()
      });
    })
  })
});

app.get('/load', function(req, res) {
  getFighters().then(function(data) {
    res.send(data);
  })
})

app.get('/boxer', function(req, res) {
  var string = transposeName(req.query.fighter);
  request(`https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:yfnajvqu4fm&q=${string}`, function(err, response, body) {
    var url = JSON.parse(body).items[0].link;

    sherdog.getBoxer(url, function(guy) {
      insertFighter(guy).then((data) => {
        console.log(guy)
        res.send(guy)
      });
    }, req.query.fighter)
  })
})

app.delete('/search', function(req, res) {
  removeFighter(req.body.fighter).then(()=> {
    res.end();
  })
})

app.get('/test', function(req, res) {
  sherdog.getBoxer();
  res.end()
})
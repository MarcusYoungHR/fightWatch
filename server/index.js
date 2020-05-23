var express = require('express');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize')
const request = require('request');
var sherdog = require('sherdog');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
//const {insertFighter, getFighters, removeFighter, getNameList, insertUser} = require('../database-mysql/index.js')

//var SequelizeStore = require('connect-session-sequelize')(expressSession.Store);

// var sequelize = new Sequelize( "fighterDB", "root", "password", {
//   dialect: "mysql"
// });

var app = express();
app.use(bodyParser());
app.use(express.static(__dirname + '/../react-client/dist'));

app.listen(3000, function () {
  console.log('listening on port 3000!');
});

// var myStore = new SequelizeStore({
//   db: sequelize
// })

// app.use(expressSession({
//   secret: 'rent free',
//   store: myStore,
//   saveUninitialized: false,
//   resave: false,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24,
//     secure: false
//   },
//   name: 'fightWatchId'
// }))

// myStore.sync();

var transposeName = function(name) {
  var butt = name.replace(/ /g, '+');
  return butt;
}

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

app.post('/signup', function(req, res) {
  console.log('sessionId \n', req.session)
  // insertUser(req.body.user).then(() => {
  //   console.log('request cookie \n', req.cookie)
  //   res.end()
  // })
  res.end()
})

app.post('/sessionTest', function(req, res) {
  req.session.userId = 'buttplug'
  res.end()
})

app.get('/load', function(req, res) {
  getFighters().then(function(data) {
    res.send(data);
  })
})

app.get('/boxer', function(req, res) {
  var string = transposeName(req.query.fighter);
  request(`https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:d2e5d7wqupx&q=${string}`, function(err, response, body) {
    var url = JSON.parse(body).items[0].link
    sherdog.getBoxer(url, function(guy) {
      insertFighter(guy).then((data) => {
        console.log(guy)
        res.send(guy)
      })
    })
  })
})

app.delete('/search', function(req, res) {
  removeFighter(req.body.fighter).then(()=> {
    res.end();
  })
})
//            ms     s    m    h
let dayInMS = 1000 * 60 * 60 * 24

const refreshList = function() {
  getNameList().then((data) => {
    for (let i = 0; i < data.length; i ++) {
      if (data[i].style === 'boxing') {
        refreshBoxer(data[i].name)
      } else if (data[i].style === 'mma') {
        refreshFighter(data[i].name)
      }
    }
    setTimeout(refreshList, dayInMS)
  })
}

const refreshBoxer = function(boxer) {
  var string = transposeName(boxer);
  request(`https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:d2e5d7wqupx&q=${string}`, function(err, response, body) {
    var url = JSON.parse(body).items[0].link
    sherdog.getBoxer(url, function(guy) {
      insertFighter(guy)
    })
  })
}

const refreshFighter = function (fighter) {
  var string = transposeName(fighter);
  request(`https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:xatgqbhqag0&q=${string}`, function(err, response, body) {
    var url = JSON.parse(body).items[0].link;
    sherdog.getFighter(url, function(data) {
      insertFighter(data)
    })
  })
}

//refreshList()
//^^^^ uncomment when server is deployed
var express = require('express');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize')
const request = require('request');
var sherdog = require('sherdog');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
const { insertFighter, getFighters, removeFighter, getNameList, insertUser, registerGetUser, loginGetUser } = require('../database-mysql/index.js')
const path = require('path')

var SequelizeStore = require('connect-session-sequelize')(expressSession.Store);

const serverSequelize = new Sequelize('fighterDB', 'Marcus', '4815162342Aa!', {
  host: 'ec2-18-191-68-100.us-east-2.compute.amazonaws.com',
  dialect: 'mysql',
  logging: false,
  port: 3306
});

var app = express();
app.use(bodyParser());

//TODO: Optimize registering process by removing registerGetUser

app.listen(3000, function () {
  console.log('listening on port 3000!');
});

var myStore = new SequelizeStore({
  db: serverSequelize
})

myStore.sync();

app.use(expressSession({
  secret: 'rent free',
  store: myStore,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secure: false
  },
  name: 'fightWatchId'
}))

app.use(express.static(__dirname + '/../react-client/dist'));


var transposeName = function (name) { //helper function to tranpose names so they are google searchable
  var transposed = name.replace(/ /g, '+');
  return transposed;
}

const redirectLogin = (req, res, next) => { //custom middleware i define
  if (!req.session.userId) { //true if session object is uninitialized, ie we didnt put any data on the sessions object. checking to see if the user is logged in or not
    console.log('redirectLogin: user is NOT logged in ')
    res.redirect('/') //redirects to the login page if the user is not logged in
  } else { //if the user is logged in
    console.log('redirectLogin: user is logged in')
    next() //move onto next middleware
  }
}

const redirectHome = (req, res, next) => {
  if (req.session.userId) { //checks to see if user is authenticated
    myStore.get(req.sessionID, (err) => {
      if (err) {
        console.log('bad session hash')
        res.session.destroy()
        res.clearCookie('fightWatchId')
        next()
      } else {
        res.redirect('/home') //if they are authenticated, redirect to home
      }
    })
  } else {
    console.log('this got triggered at least')
    next() //if they are not authenticated move onto next middleware
  }
}

app.get('/', redirectHome, (req, res) => {
  console.log('hit root endpoint \n')
  res.sendFile(path.resolve('react-client/dist/login.html'))
})



app.get('/search', function (req, res) { //search sherdog for mma fighter
  var string = transposeName(req.query.fighter);
  request(`https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:xatgqbhqag0&q=${string}`, function (err, response, body) {
    var url = JSON.parse(body).items[0].link;
    sherdog.getFighter(url, function (data) {
      insertFighter(data).then((data) => {
        res.end()
      });
    })
  })
});

app.post('/login', (req, res) => {
  const userData = { username: req.body.username, password: req.body.password }

  loginGetUser(userData).then((data) => {
    //console.log('express login data \n', data);
    if (data === null) {
      console.log('incorrect login info')
      res.redirect('/')
    } else {
      req.session.userId = data.id
      req.session.save(()=> {
        res.redirect('/home')
      })

    }
  })


})


app.post('/register', (req, res) => {
  //what am i trying to do
  // var userData = {username: req.body.username, password: req.body.password}
  // getUser(req.body.username).then((user) => { //when a user registers we look him up in the users table
  //   if (user === null) {//if there is no matching user
  //     insertUser(userData)//insert the user into the users table
  //     req.session.userId = userData.username//set user.id on the request object
  //     //redirect to /home
  //   }//if there is a matching user
  //     //redirect to /register
  // })
  const userData = { username: req.body.username, password: req.body.password }
  console.log('hit register endpoint')
  registerGetUser(userData.username).then((user) => {
    if (user === null) {
      insertUser(userData).then((userId) => {
        req.session.userId = userId;
        req.session.save(()=> {
          res.redirect('/home')
        })
      })
    } else {
      res.redirect('/')
    }
  })
})

app.get('/home', redirectLogin, (req, res) => {
  res.sendFile((path.resolve('react-client/dist/home.html')))
})

app.post('/signup', function (req, res) {
  console.log('sessionId \n', req.session)
  insertUser(req.body.user).then(() => {
    console.log('request cookie \n', req.cookie)
    res.end()
  })
  res.end()
})

app.post('/sessionTest', function (req, res) {
  req.session.userId = 'buttplug'
  res.end()
})

app.get('/load', function (req, res) {
  getFighters().then(function (data) {
    res.send(data);
  })
})

app.get('/boxer', function (req, res) { //search boxrec for boxer
  var string = transposeName(req.query.fighter);
  request(`https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:d2e5d7wqupx&q=${string}`, function (err, response, body) {
    var url = JSON.parse(body).items[0].link
    sherdog.getBoxer(url, function (guy) {
      insertFighter(guy).then((data) => {
        console.log(guy)
        res.send(guy)
      })
    })
  })
})

app.delete('/search', function (req, res) { //delete fighter from database
  removeFighter(req.body.fighter).then(() => {
    res.end();
  })
})
//            ms     s    m    h
let dayInMS = 1000 * 60 * 60 * 24

const refreshList = function () { //refresh all fighters
  getNameList().then((data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].style === 'boxing') {
        refreshBoxer(data[i].name)
      } else if (data[i].style === 'mma') {
        refreshFighter(data[i].name)
      }
    }
    setTimeout(refreshList, dayInMS)
  })
}

const refreshBoxer = function (boxer) { //helper function to refresh boxers
  var string = transposeName(boxer);
  request(`https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:d2e5d7wqupx&q=${string}`, function (err, response, body) {
    var url = JSON.parse(body).items[0].link
    sherdog.getBoxer(url, function (guy) {
      insertFighter(guy)
    })
  })
}

const refreshFighter = function (fighter) { //helper function to refresh mma fighters
  var string = transposeName(fighter);
  request(`https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:xatgqbhqag0&q=${string}`, function (err, response, body) {
    var url = JSON.parse(body).items[0].link;
    sherdog.getFighter(url, function (data) {
      insertFighter(data)
    })
  })
}

//refreshList()
//^^^^ uncomment when server is deployed
var express = require('express');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize')
const request = require('request');
const { SDGetBoxer, SDGetFighter } = require('./scraper.js');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
const { insertFighter, insertBoxer, getFighters, removeFighter, removeBoxer, getNameList, insertUser, getUser, loginGetUser, getSingleFighter, getSingleBoxer, associateFighter, associateBoxer, updateFighter, updateBoxer, getBoxerList, getUserList } = require('../database-mysql/index.js')
const path = require('path')
const { downloadImg, transposeName, capitalizeWords, transposeImgName } = require('./utils.js')
const { s3Uploader } = require('./s3Upload.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const mmaUrl = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:xatgqbhqag0&q='

const boxingUrl = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:d2e5d7wqupx&q='

const scrapeWeb = function (customSearch, name, req, res, getMethod, insertMethod, singleSearch, associate) {
  request(customSearch + name, function (err, response, body) {
    let parsedBody = JSON.parse(body)
    if (!parsedBody.items) {
      if (parsedBody.spelling) {
        singleSearch({ name: parsedBody.spelling.correctedQuery }).then((data) => {
          if (data === null) {
            scrapeWeb(customSearch, transposeName(parsedBody.spelling.correctedQuery), req, res, getMethod, insertMethod, singleSearch)
          } else {
            console.log('spelling error fighter found in database')
            associate(data, req.session.userId).then(() => {
              console.log('---------------------------------------------------------------- \n')
              res.status(200).send(data.dataValues)
            })
          }
        })
      } else {
        res.sendStatus(400)
      }
    } else {
      let url = JSON.parse(body).items[0].link;
      console.log('made it this far \n', url)
      getMethod(url, function (data) {
        s3Uploader(data.image, data.name, () => {
          data.image = 'https://fightwatchimages.s3.us-east-2.amazonaws.com/' + transposeImgName(data.name)
          insertMethod(data, req.session.userId).then((feta) => {
            res.status(200).send(data)
          });
        }, () => {
          res.sendStatus(400)
        })
      }, () => { res.sendStatus(400) })
    }
  })
}

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

const redirectLogin = (req, res, next) => { //custom middleware i define
  if (!req.session.userId) { //true if session object is uninitialized, ie we didnt put any data on the sessions object. checking to see if the user is logged in or not
    console.log('redirectLogin: user is NOT logged in ')
    res.redirect('/') //redirects to the login page if the user is not logged in
  } else { //if the user is logged in
    console.log('redirectLogin: user is logged in')
    myStore.get(req.sessionID, (err) => {
      if (err) {
        console.log('bad session hash')
        res.session.destroy()
        res.clearCookie('fightWatchId')
        res.redirect('/')
      } else {
        console.log('good session hash')
        next()
      }
    })
    //move onto next middleware
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
  let string = capitalizeWords(req.query.fighter.toLowerCase());
  //console.log(string)
  getSingleFighter({ name: string, style: 'mma' }).then((data) => {
    if (data === null) {
      string = transposeName(string)
      console.log('fighter not found in database')
      scrapeWeb(mmaUrl, string, req, res, SDGetFighter, insertFighter, getSingleFighter, associateFighter)
    } else {
      console.log('fighter found in database')
      associateFighter(data, req.session.userId).then(() => {
        res.status(200).send(data.dataValues)
      });
    }
  })
});

app.get('/boxer', function (req, res) { //search boxrec for boxer
  let string = capitalizeWords(req.query.fighter.toLowerCase());
  getSingleBoxer({ name: string, style: 'boxing' }).then((data) => {
    if (data === null) {
      console.log('boxer not found in database')
      var string = transposeName(req.query.fighter);
      scrapeWeb(boxingUrl, string, req, res, SDGetBoxer, insertBoxer, getSingleBoxer, associateBoxer)
    } else {
      console.log('fighter found in database')
      associateFighter(data, req.session.userId).then(() => {
        res.status(200).send(data.dataValues)
      })
    }
  })
})

app.post('/login', (req, res) => {
  //const userData = { username: req.body.username, password: req.body.password }
  const { username, password } = req.body

  getUser(username).then((data) => {
    //console.log('express login data \n', data);
    if (data === null) {
      console.log('incorrect login info')
      //res.redirect('/')
      res.status(403).send('username not found')
    } else {
      bcrypt.compare(password, data.password, function (err, result) {
        if (result == true) {
          req.session.userId = data.id
          req.session.username = username
          req.session.save(() => {
            //res.redirect('/home')
            res.status(200).send('good job')
          })
        } else {
          console.log('incorrect password')
          res.status(403).send('incorrect password')
        }
      });
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
  let userData = { username: req.body.username, password: req.body.password }
  console.log('hit register endpoint')
  getUser(userData.username).then((user) => {
    if (user === null) {
      bcrypt.hash(userData.password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        //console.log('userdata \n', userData, '\nhashed password \n', hash)
        insertUser({ username: userData.username, password: hash }).then((userId) => {
          req.session.userId = userId;
          req.session.username = userData.username
          req.session.save(() => {
            //res.redirect('/home')
            res.status(200).send('registration successful')
          })
        })
      });
    } else {
      res.status(400).send('user already exists')
    }
  })
})

app.post('/logout', redirectLogin, (req, res) => {
  console.log('logout endpoint hit')
  req.session.destroy(() => {
    res.clearCookie('fightWatchId')
    res.redirect('/')
  })
})

app.get('/home', redirectLogin, (req, res) => {
  res.sendFile((path.resolve('react-client/dist/home.html')))
})


app.get('/load', function (req, res) {
  //console.log(req.session)
  getFighters(req.session.userId).then(function (data) {
    data.push(req.session.username)
    res.send(data);
  })
})

app.get('/userCount', function (req, res) {
  getUserList().then((data) => {
    console.log('did this work?')
    res.send({ stupid: data })
  })
})

app.delete('/boxer', function (req, res) { //delete fighter from database
  removeBoxer(req.body.fighter, req.session.userId).then(() => {
    res.end();
  })
})

app.delete('/search', function (req, res) { //delete fighter from database
  removeFighter(req.body.fighter, req.session.userId).then(() => {
    res.end();
  })
})
//            ms     s    m    h
let dayInMS = 1000 * 60 * 60 * 24

// const refreshList = function () { //refresh all fighters
//   getNameList().then((data) => {
//     for (let i = 0; i < data.length; i++) {
//       refreshFighter(data[i])
//     }
//   }).then(()=> {
//     getBoxerList().then((boxers)=> {
//       for (let i = 0; i < boxers.length; i ++) {
//         refreshBoxer(boxers[i])
//       }
//     }).then(()=> {
//       setTimeout(refreshList, dayInMS)
//     })
//   })
// }

const refreshBoxer = function (array, index) {
  console.log('the index is: ', index)
  console.log(array[index].name)
  if (index >= array.length) {
    return
  } else {
    let { url } = array[index]
    SDGetBoxer(url, (data) => {
      data.next_fight = 'weiner'
      updateBoxer(data).then(() => {
        refreshBoxer(array, index + 1)
      })
    })
  }
}

// const refreshFighter = function (fighter) { //helper function to refresh mma fighters
//   var string = transposeName(fighter);
//   request(mmaUrl + string, function (err, response, body) {
//     var url = JSON.parse(body).items[0].link;
//     sherdog.getFighter(url, function (data) {
//       insertFighter(data)
//     })
//   })
// }

const refreshList = function () {
  getNameList().then((data) => {
    refreshFighter(data, 0)
  })
  setTimeout(refreshList, dayInMS)
  // getBoxerList().then((data)=> {
  //   refreshBoxer(data, 0)
  // })
}

const refreshFighter = function (array, index) {
  if (index >= array.length) {
    return
  } else {
    let { url } = array[index]
    console.log(array[index].name)
    SDGetFighter(url, (data) => {
      updateFighter(data).then(() => {
        refreshFighter(array, index + 1)
      })
    })
  }
}
//


//refreshList()
//^^^^ uncomment when server is deployed


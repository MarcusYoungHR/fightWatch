const Sequelize = require('sequelize');

const sequelize = new Sequelize('fighterDB', 'Marcus', '4815162342Aa!', {
  host: 'ec2-18-191-68-100.us-east-2.compute.amazonaws.com',
  dialect: 'mysql',
  logging: false,
  port: 3306
});

sequelize.authenticate().then(() => {
  console.log('connected to mysql');
}).catch((err) => {
  console.log('ah fuck', err);
})

var model = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  next_fight: {
    type: Sequelize.STRING,

  },
  next_opponent: {
    type: Sequelize.STRING
  },
  image: {
    type: Sequelize.STRING
  },
  style: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  }
}

var boxers = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  next_fight: {
    type: Sequelize.STRING,

  },
  next_opponent: {
    type: Sequelize.STRING
  },
  image: {
    type: Sequelize.STRING
  },
  style: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  }
}

var users = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  }
}

const Boxer = sequelize.define('Boxers', boxers)
const Fighter = sequelize.define('Fighters', model)
const User = sequelize.define('Users', users);

Fighter.belongsToMany(User, { through: 'UserFighter' })
User.belongsToMany(Fighter, { through: 'UserFighter' })

Boxer.belongsToMany(User, { through: 'UserBoxer' })
User.belongsToMany(Boxer, { through: 'UserBoxer' })


sequelize.sync()
// sequelize.sync({ force: true }) //i think force:true drops tables
//creates the table if it doesn't exist

const insertFighter = function (obj, sessId) {
  return Fighter.create(obj, { returning: true }).then((fighterData) => {
    //console.log('inserted a fighter \n', fighterData);
    return User.findOne({
      where: {
        id: sessId
      }
    }).then((userData) => {
      //console.log('fighterData in findOne promise \n', fighterData)
      //return fighterData.setUser(userData)
      return userData.addFighter(fighterData)
    }).then((success) => {
      console.log('user fighter join success')
      return
    }).catch((err) => {
      console.log('user fighter join error \n', err)
      return
    })
  }).catch((err) => {
    console.log('error inserting fighter \n'); //maybe start console logging error here again
    return Fighter.findOne({ where: { name: obj.name } }).then((fighterData) => {
      return associateFighter(fighterData, sessId)
    })
  })
}

const insertBoxer = function (obj, sessId) {
  return Boxer.create(obj, { returning: true }).then((fighterData) => {
    //console.log('inserted a fighter \n', fighterData);
    return User.findOne({
      where: {
        id: sessId
      }
    }).then((userData) => {
      //console.log('fighterData in findOne promise \n', fighterData)
      //return fighterData.setUser(userData)
      return userData.addBoxer(fighterData)
    }).then((success) => {
      console.log('user boxer join success')
      return
    }).catch((err) => {
      console.log('user boxer join error \n', err)
      return
    })
  }).catch((err) => {
    console.log('error inserting boxer \n'); //maybe start console logging error here again
    return Fighter.findOne({ where: { name: obj.name } }).then((fighterData) => {
      return associateBoxer(fighterData, sessId)
    })
  })
}

const associateFighter = function (fighterData, sessId) {
  return User.findOne({ where: { id: sessId } }).then((userData) => {
    return userData.addFighter(fighterData)
  }).then(() => {
    console.log('associateFighter: successfully associated fighter')
    return
  }).catch((err) => {
    console.log('associateFighter: error associating fighter \n', err)
    return
  })
}

const associateBoxer = function (fighterData, sessId) {
  return User.findOne({ where: { id: sessId } }).then((userData) => {
    return userData.addBoxer(fighterData)
  }).then(() => {
    console.log('associateBoxer: successfully associated fighter')
    return
  }).catch((err) => {
    console.log('associateBoxer: error associating fighter \n', err)
    return
  })
}

const getFighters = function (sessId) {
  return User.findOne({
    where: { id: sessId },
    include: [{
      model: Fighter,
      through: {
        attributes: []
      }
    },
    {
      model: Boxer,
      through: {
        attributes: []
      }
    }]
  }).then((data) => {
    //console.log(JSON.parse(JSON.stringify(data, null, 2)))
    return [JSON.parse(JSON.stringify(data, null, 2)).Fighters, JSON.parse(JSON.stringify(data, null, 2)).Boxers]
  }).catch((err) => {
    console.log('getFighters err \n', err)
  })
}

const getSingleFighter = function (fighter) {
  return Fighter.findOne({
    where: {
      name: fighter.name,
      style: fighter.style
    }
  }).then((data) => {
    console.log('getSingleFighter data: \n', data)
    return data
  })
}

const getSingleBoxer = function (fighter) {
  return Boxer.findOne({
    where: {
      name: fighter.name,
      style: fighter.style
    }
  }).then((data) => {
    console.log('getSingleBoxer data')
    return data
  })
}

const getNameList = function () {
  return Fighter.findAll({ attributes: ['name', 'url'], raw: true }).then(function (data) {
    console.log('retreived fighter names \n', data)
    return data
  }).catch(function (err) {
    console.log('failed to retrieve fighter names \n', err)
    return
  })
}

const getBoxerList = function () {
  return Boxer.findAll({ attributes: ['name', 'url'], raw: true }).then(function (data) {
    console.log('retreived fighter names \n', data)
    return data
  }).catch(function (err) {
    console.log('failed to retrieve fighter names \n', err)
    return
  })
}

const removeFighter = function (name, sessId) {
  return User.findOne({
    where: { id: sessId }
  }).then((userData) => {
    return Fighter.findOne({ where: { name: name } }).then((fighterData) => {
      return userData.removeFighter(fighterData)
    }).catch((err) => {
      console.log('nested removeFighter err \n', err)
      return
    })
  }).catch((err) => {
    console.log('removeFighter err \n', err)
    return
  })
}

const removeBoxer = function (name, sessId) {
  return User.findOne({
    where: { id: sessId }
  }).then((userData) => {
    return Boxer.findOne({ where: { name: name } }).then((fighterData) => {
      return userData.removeBoxer(fighterData)
    }).catch((err) => {
      console.log('nested removeBoxer err \n', err)
      return
    })
  }).catch((err) => {
    console.log('removeBoxer err \n', err)
    return
  })
}

const insertUser = function (user) {
  return User.create(user, { raw: true }).then((data) => {
    return data.dataValues.id
  }).catch((err) => {
    console.log('error inserting user \n', err);
  })
}

const registerGetUser = function (username) {
  return User.findOne({ where: { username: username } }).then((user) => {
    if (user === null) {
      console.log('no user found')
      return null
    } else {
      console.log('found user when trying to register')
      return user;
    }
  })
}

const loginGetUser = function (user) {
  const { username, password } = user
  return User.findOne({ where: { username: username, password: password }, raw: true }).then((data) => {
    if (data === null) {
      console.log('incorrect login info')
      return null
    } else {
      console.log('successfully logged in')
      return data
    }
  })
}

const updateFighter = function(fighter) {
  const {name, next_fight, next_opponent} = fighter
  return Fighter.update({next_fight: next_fight, next_opponent: next_opponent}, {where: {name: name}})
}

const updateBoxer = function(boxer) {
  const {name, next_fight, next_opponent} = boxer
  return Boxer.update({next_fight: next_fight, next_opponent: next_opponent}, {where: {name: name}})
}

module.exports = {
  insertFighter,
  insertBoxer,
  getFighters,
  removeFighter,
  removeBoxer,
  getNameList,
  insertUser,
  registerGetUser,
  loginGetUser,
  getSingleFighter,
  getSingleBoxer,
  associateFighter,
  associateBoxer,
  updateBoxer,
  updateFighter,
  getBoxerList
}


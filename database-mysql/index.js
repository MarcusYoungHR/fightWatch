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

const Fighters = sequelize.define('fighters', model)
const Users = sequelize.define('users', users);

Users.sync()
Fighters.sync()
//creates the table if it doesn't exist

const insertFighter = function(obj) {
  return Fighters.upsert(obj).then(function(data) {
    console.log('inserted a fighter \n', data)
  }).catch(function(err) {
    console.log('failed to insert: \n', err);
  })
}

const getFighters = function() {
  return Fighters.findAll().then(function(data) {
    console.log('retreived fighter list')
    return data;
  }).catch(function(err) {
    console.log('failed to retrieve list: \n', err);
  })
}

const getNameList = function() {
  return Fighters.findAll({attributes: ['name', 'style'], raw: true}).then(function(data) {
    console.log('retreived fighter names \n', data)
    return data
  }).catch(function(err) {
    console.log('failed to retrieve fighter names \n', err)
  })
}

const removeFighter = function(name) {
  return Fighters.destroy({
    where: {
      name: name
    }
  }).then(()=> {
    console.log('fighter removed')
  }).catch((err)=> {
    console.log('failed to remove fighter: \n', err)
  })
}

const insertUser = function(user) {
  return Users.create(user).then(() => {
    console.log('inserted user')
  }).catch((err) => {
    console.log('error inserting user \n', err);
  })
}

module.exports = {
  insertFighter,
  getFighters,
  removeFighter,
  getNameList,
  insertUser
}
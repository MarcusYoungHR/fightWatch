const Sequelize = require('sequelize');

const sequelize = new Sequelize('fighterDB', 'root', 'password', {
  host: 'localhost',
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
  }
}

const Fighters = sequelize.define('fighters', model)

//Fighters.sync()
//creates the table if it doesn't exist

const insertFighter = function(obj) {
  return Fighters.upsert(obj).then(function(data) {
    console.log('inserted a fighter')
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

module.exports = {
  insertFighter,
  getFighters,
  removeFighter
}
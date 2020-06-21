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

const Fighter = sequelize.define('Fighters', model)
const User = sequelize.define('Users', users);

// Fighter.belongsTo(User)
// //User.belongsTo(Fighter);
// //Fighter.hasMany(User)
// User.hasMany(Fighter);

Fighter.belongsToMany(User, { through: 'UserFighter' })
User.belongsToMany(Fighter, { through: 'UserFighter' })


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
    console.log('error inserting fighter \n', err);
  })
}

const associateFighter = function (fighterData, sessId) {
  return User.findOne({where: {id: sessId}}).then((userData)=> {
    return userData.addFighter(fighterData)
  }).then(()=> {
    console.log('associateFighter: successfully associated fighter')
    return
  }).catch((err)=> {
    console.log('associateFighter: error associating fighter \n', err)
    return
  })
}

// const getFighters = function () {
//   return Fighter.findAll().then(function (data) {
//     console.log('retreived fighter list')
//     return data;
//   }).catch(function (err) {
//     console.log('failed to retrieve list: \n', err);
//   })
// }

const getFighters = function(sessId) {
  return User.findOne({
    where: {id: sessId},
    include: {
      model: Fighter,
      through: {
        attributes: []
      }
    }
  }).then((data)=> {
    return JSON.parse(JSON.stringify(data, null, 2)).Fighters
  }).catch((err)=> {
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

const getNameList = function () {
  return Fighter.findAll({ attributes: ['name', 'style'], raw: true }).then(function (data) {
    console.log('retreived fighter names \n', data)
    return data
  }).catch(function (err) {
    console.log('failed to retrieve fighter names \n', err)
  })
}

// const removeFighter = function (name) {
//   return Fighter.destroy({
//     where: {
//       name: name
//     }
//   }).then(() => {
//     console.log('fighter removed')
//   }).catch((err) => {
//     console.log('failed to remove fighter: \n', err)
//   })
// }

const removeFighter = function(name, sessId) {
  return User.findOne({
    where: {id: sessId}
  }).then((userData)=> {
    return Fighter.findOne({where: {name: name}}).then((fighterData)=> {
      return userData.removeFighter(fighterData)
    }).catch((err)=> {
      console.log('nested removeFighter err \n', err)
      return
    })
  }).catch((err)=> {
    console.log('removeFighter err \n', err)
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

module.exports = {
  insertFighter,
  getFighters,
  removeFighter,
  getNameList,
  insertUser,
  registerGetUser,
  loginGetUser,
  getSingleFighter,
  associateFighter
}

// const insertFighter = function(obj) {
//   return Fighters.upsert(obj, {returning: true}).then(function(data) {
//     console.log('inserted a fighter \n', data)
//     return Users.findOne({
//       where: {
//         id: 1
//       }
//     }).then((user) => {
//       //console.log('please work data \n', data, '\nplease work user \n', user)
//       return user.setFighters()
//     }).then((something) => {
//       console.log('associated fighter with user \n', data)
//     }).catch((err) => {
//       console.log('error in associating \n', err);
//     })
//   }).catch(function(err) {
//     console.log('failed to insert: \n', err);
//   })
// }
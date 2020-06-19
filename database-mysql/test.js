const Sequelize = require('sequelize');

const conn = new Sequelize('testing', 'Marcus', '4815162342Aa!', {
  host: 'ec2-18-191-68-100.us-east-2.compute.amazonaws.com',
  dialect: 'mysql',
  logging: false,
  port: 3306
});
//f
conn.authenticate().then(() => {
  console.log('connected to mysql');
}).catch((err) => {
  console.log('ah fuck -------------------------------------------------------------------- \n', err);
})

const Ship = conn.define('ship', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  purpose: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
const Member = conn.define('member', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  species: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const seed = () => {
  return Promise.all([
    Ship.create({ name: 'Enterprise', purpose: 'exploration' }),
    Ship.create({ name: 'Planet Express', purpose: 'delivery' }),
    Member.create({ name: 'Kirk', species: 'human' }),
    Member.create({ name: 'Spock', species: 'hybrid' }),
    Member.create({ name: 'McCoy', species: 'human' }),
    Member.create({ name: 'Leela', species: 'mutant' }),
    Member.create({ name: 'Fry', species: 'human' }),
    Member.create({ name: 'Bender', species: 'robot' })
  ])
  .then(([enterprise, planetexpress, kirk, spock, mccoy, leela, fry, bender]) => {
    console.log('kirk -------------------------------------------------------\n', kirk);
    console.log('enterprise -------------------------------------------------\n', enterprise)
    return Promise.all([
      kirk.setShip(enterprise),
      spock.setShip(enterprise),
      mccoy.setShip(enterprise),
      leela.setShip(planetexpress),
      fry.setShip(planetexpress),
      bender.setShip(planetexpress)
    ]);
  })
  .catch(error => console.log(error));
};

Member.belongsTo(Ship);
Ship.hasMany(Member);

conn.sync({ force: true })
  .then(() => seed());


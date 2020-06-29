const boxrec = require("boxrec").Boxrec;

var buttChug = async function() {
  const cookieJar = await boxrec.login('marcusisabeast', '4815162342Aa');

  const gennadyGolovkin = await boxrec.getPersonById(cookieJar, 352);

  console.log(gennadyGolovkin.bouts[5].opponent.name);
}

buttChug()
const boxrec = require("boxrec").Boxrec;

var buttChug = async function() {
  const cookieJar = await boxrec.login('marcusisabeast', '4815162342Aa');

  const gennadyGolovkin = await boxrec.getPersonById(cookieJar, 352);
  const gennadyGolovkin1 = await boxrec.getPersonById(cookieJar, 1);
  const gennadyGolovkin2 = await boxrec.getPersonById(cookieJar, 2);
  const gennadyGolovkin3 = await boxrec.getPersonById(cookieJar, 3);
  const gennadyGolovkin4 = await boxrec.getPersonById(cookieJar, 4);
  const gennadyGolovkin5 = await boxrec.getPersonById(cookieJar, 5);
  const gennadyGolovkin6 = await boxrec.getPersonById(cookieJar, 7);
  const gennadyGolovkin7 = await boxrec.getPersonById(cookieJar, 8);
  const gennadyGolovkin8 = await boxrec.getPersonById(cookieJar, 9);
  try {console.log(gennadyGolovkin.bouts[5].opponent.name);} catch(err) {console.log(err)}
}

buttChug()
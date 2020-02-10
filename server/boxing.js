const request = require('request');
var cheerio = require("cheerio");
const boxrec = require("boxrec").Boxrec;


const butts = async function() {
  const cookieJar = await boxrec.login('marcusisabeast', '4815162342Aa')
  const gennadyGolovkin = await boxrec.getPersonById(cookieJar, 356831);

  console.log(gennadyGolovkin.division);
}

butts()
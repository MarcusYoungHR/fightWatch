var request = require("request");
var cheerio = require("cheerio");


module.exports.SDGetBoxer = function (url, callback, errorCB) {
  request(url, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      //console.log(body);
      var $ = cheerio.load(body);

      var boxer = {
        name: '',
        image: '',
        next_opponent: '',
        next_fight: '',
        style: 'boxing',
        url: url,

      }
      try {
        var nextOpponent = $('a[class=personLink]', '.dataTable')[0].children[0].data
        //console.log($('a[class=personLink]', '.dataTable'))
        var name = $('h1', 'td')[0].children[0].data
        var img = $('img').attr('src')
        var upComing = $('.boutResult').text()[0] === 'S'
        var date = $('a', '.dataTable')[0].children[0].data
      } catch (error) {
        console.log('catch block triggered')
        errorCB()
        return
      }

      console.log('outside of catch block')

      if (upComing === true) {
        boxer.next_fight = date;
        boxer.next_opponent = nextOpponent;

      } else {
        boxer.next_fight = 'TBA';
        boxer.next_opponent = 'TBA';
      }
      boxer.name = name;
      boxer.image = img;
      //console.log(nextOpponent)
      callback(boxer)
    }
  })
}


module.exports.SDGetFighter = function (url, callback) {

  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {

      var $ = cheerio.load(html);

      //----------------------------------+
      //  JSON object for Fighter
      //----------------------------------+
      var fighter = {
        name: "",
        image: "",
        next_opponent: '',
        next_fight: '',
        style: 'mma',
        url: url,

      };


      $('.date_location').filter(function () {
        var el = $(this);
        var date = el.find('h4').text();
        var index = date.indexOf('/');
        date = date.slice(0, index);
        fighter.next_fight = date

      })

      $('.right_side', '.event').filter(function () {
        var el = $(this);
        var name = el.find('span[itemprop="name"]').text();
        fighter.next_opponent = name

      })
      // Fighter name, nickname

      $('.bio_fighter').filter(function () {
        var el = $(this);
        name = el.find('span.fn').text();
        nickname = el.find('span.nickname').text();
        fighter.name = name;


      });
      // Fighter image
      fighter.image = 'https://www.sherdog.com' + $(".profile_image.photo").attr("src");
      console.log('fighter image \n', fighter.image)



      if (!fighter.next_fight) {
        fighter.next_fight = 'TBA'
        fighter.next_opponent = 'TBA'

      }

      callback(fighter);
    }
  });
}
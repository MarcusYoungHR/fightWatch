/*app.get('/search', function (req, res) { //search sherdog for mma fighter
  let string = capitalizeWords(req.query.fighter.toLowerCase());
  //console.log(string)
  getSingleFighter({ name: string, style: 'mma' }).then((data) => {
    if (data === null) {
      string = transposeName(string)
      console.log('fighter not found in database')
      request(`https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:xatgqbhqag0&q=${string}`, function (err, response, body) {
        console.log('google search body \n', JSON.parse(body).spelling)
        var url = JSON.parse(body).items[0].link;
        console.log('made it this far \n', url)
        sherdog.getFighter(url, function (data) {
          s3Uploader(data.image, data.name, ()=> {
            data.image = 'https://fightwatchimages.s3.us-east-2.amazonaws.com/' + transposeImgName(data.name)
            insertFighter(data, req.session.userId).then((data) => {
              res.end()
            });
          }, ()=> {
            res.sendStatus(400)
          })
        })
      })
    } else {
      console.log('fighter found in database')
      associateFighter(data, req.session.userId).then(()=> {
        res.end()
      });
    }
  })
});*/

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

// const getFighters = function () {
//   return Fighter.findAll().then(function (data) {
//     console.log('retreived fighter list')
//     return data;
//   }).catch(function (err) {
//     console.log('failed to retrieve list: \n', err);
//   })
// }

/**
 * app.get('/boxer', function (req, res) { //search boxrec for boxer
  let string = capitalizeWords(req.query.fighter.toLowerCase());
  getSingleBoxer({name: string, style: 'boxing'}).then((data)=> {
    if (data === null) {
      console.log('boxer not found in database')
      var string = transposeName(req.query.fighter);
      request(`https://www.googleapis.com/customsearch/v1?key=AIzaSyAgLmwFLMuqANxoLxNVrILaslMuNUy9DF8&cx=007218699401475344710:d2e5d7wqupx&q=${string}`, function (err, response, body) {
        var url = JSON.parse(body).items[0].link
        sherdog.getBoxer(url, function (data) {
          s3Uploader(data.image, data.name, ()=> {
            data.image = 'https://fightwatchimages.s3.us-east-2.amazonaws.com/' + transposeImgName(data.name)
            insertBoxer(data, req.session.userId).then((data) => {
              res.end()
            });
          }, ()=> {
            res.sendStatus(400)
          })
        })
      })
    } else {
      console.log('fighter found in database')
      associateFighter(data, req.session.userId).then(()=> {
        res.end()
      })
    }
  })
})
 */
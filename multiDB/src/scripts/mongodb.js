// docker ps // para pegar o id

// docker exec -it 39bb0e7c73d7 //id mongo -u pedro -p 12345 -authenticationDatabase heroes

// show dbs || use heroes  || show collections

db.heroes.insert({
  name: 'Flash',
  power: 'Speed',
  birthDate: '1998-06-25'
})

db.heroes.find().pretty();

db.heroes.find({ name: 'Flash' });

db.heroes.update({ _id: ObjectId('61ec4d132b1fbc7324cee009') }, { name: 'Batman' }); // apaga os outros campos

db.heroes.update({ _id: ObjectId('61ec540f32c720f0fd7eefb6') }, { $set: { name: 'Batman' } }); // conserva os outros campos

db.heroes.remove({}) //perigoso, remove tudo

db.heroes.remove({ _id: ObjectId('61ec4d132b1fbc7324cee009') })

// yarn add mongoose

// const Mongoose = require('mongoose');

// Mongoose.connect('mongodb://pedro:12345@localhost:27017/heroes', { useNewUrlParser: true }, function (error) {
//   if (!error) {
//     return;
//   }

//   console.error('Falha conexão mongoose', error);
// })

// const connection = Mongoose.connection;

// connection.once('open', () => console.log('Db connect'));

// const state = connection.readyState;

// console.log(state);

// 0 disconnected || 1 Connected || 2 Connecting || 3 Disconnecting

const ICrud = require('./interfaces/ICrud');
const Mongoose = require('mongoose');
class MongoDB extends ICrud {
  constructor() {
    super();
    this._heroes = null;
    this._driver = null;
  }

  async create(item) {

    return this._heroes.create(item)
  }

  async isConnected() {
    const state = this._driver.readyState
    if (state === 1) {
      return state
    } else if (state === 2) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return state
    } else {
      return state
    }
  }

  connect() {
    Mongoose.connect('mongodb://pedro:12345@localhost:27017/heroes',
      { useNewUrlParser: true }, function (error) {
        if (!error) {
          return;
        }

        console.error('Falha conexão mongoose', error);
      });

    this._driver = Mongoose.connection;

    this._driver.once('open', () => console.log('DB connect'));

    this.defineModel()
  }

  defineModel() {
    const heroSchema = new Mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      power: {
        type: String,
        required: true
      },
      insertAt: {
        type: Date,
        default: new Date()
      }
    })

    this._heroes = Mongoose.models.heroes ? Mongoose.models.heroes : Mongoose.model('heroes', heroSchema)

  }

  async read(query, skip = 0, limit = 10) {
    return this._heroes.find(query).skip(skip).limit(limit)
  }

  async update(id, item) {
    return this._heroes.updateOne({ _id: id }, { $set: item });
  }

  async delete(id) {
    return this._heroes.deleteOne({ _id: id });
  }

}

module.exports = MongoDB
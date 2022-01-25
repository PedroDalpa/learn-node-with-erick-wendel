const ICrud = require('../interfaces/ICrud');
const Mongoose = require('mongoose');
class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  async create(item) {

    return this._schema.create(item)
  }

  async isConnected() {
    const state = this._connection.readyState
    if (state === 1) {
      return state
    } else if (state === 2) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return state
    } else {
      return state
    }
  }

  static connect() {
    Mongoose.connect(process.env.MONGO_URL,
      { useNewUrlParser: true }, function (error) {
        if (!error) {
          return;
        }

        console.error('Falha conexão mongoose', error);
      });

    const connection = Mongoose.connection;

    connection.once('open', () => console.info('mongo DB connect'));

    return connection;
  }

  async read(query, skip = 0, limit = 10) {
    return this._schema.find(query).skip(skip).limit(limit)
  }

  async update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item });
  }

  async delete(id) {
    return this._schema.deleteOne({ _id: id });
  }

}

module.exports = MongoDB
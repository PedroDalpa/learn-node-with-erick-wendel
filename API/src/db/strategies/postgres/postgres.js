const ICrud = require('../interfaces/ICrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }

  async create(item) {
    return await this._schema.create(item)
  }

  async read(query) {
    return await this._schema.findAll({ where: query, raw: true });
  }

  async update(id, item, upsert = false) {
    const insertOrUpdate = upsert ? 'upsert' : 'update';

    await this._schema[insertOrUpdate](item, { where: { id } })
  }

  async delete(id) {
    const query = id ? { id } : {};

    return await this._schema.destroy({ where: query });
  }

  async isConnected() {
    try {
      await this._connection.authenticate();

      return true;
    } catch (error) {
      console.error('Fail to connect DB', error);

      return false;
    }
  }

  static async connect() {
    try {
      const connection = new Sequelize(process.env.POSTGRES_URL, {
        quoteIdentifiers: false,
        logging: false,
        dialectOptions: process.env.SSL_DB ? {
          ssl: {
            require: eval(process.env.SSL_DB),
            rejectUnauthorized: eval(process.env.SSL_DB_REJECT),
          }
        } : {},
      })

      console.info('postgres DB connect');

      return connection
    } catch (error) {
      console.error(error);
      return false
    }
  }

  static async defineModel(connection, schema) {

    const model = connection.define(schema.name, schema.schema, schema.options);

    await model.sync();

    return model;
  }

}


module.exports = Postgres
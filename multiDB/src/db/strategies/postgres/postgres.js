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

  async update(id, item) {
    await this._schema.update(item, { where: { id } })
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
    const connection = new Sequelize(
      'heroes',
      'user',
      'admin',
      {
        host: 'localhost',
        dialect: 'postgres',
        queueIdentifiers: false,
        operatorAliases: false,
        logging: false
      }
    )

    return connection
  }

  static async defineModel(connection, schema) {

    const model = connection.define(schema.name, schema.schema, schema.options);

    await model.sync();

    return model;
  }

}


module.exports = Postgres
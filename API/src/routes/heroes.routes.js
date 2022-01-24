const BaseRoutes = require('./index.routes')
const Joi = require('joi');

class HeroRoutes extends BaseRoutes {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/heroes',
      method: 'GET',
      options: {
        validate: {
          query: Joi.object({
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            name: Joi.string().min(3).max(100)
          }).options({ stripUnknown: true }),
          failAction: (request, headers, erro) => {
            throw erro
          }
        }
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, name } = request.query;

          const query = name ? { name: { $regex: `.*${name}*.` } } : {};

          return this.db.read(query, skip, limit);
        } catch (error) {
          console.error(error);

          return 'Erro interno'
        }
      }
    }
  }

  create() {
    return {
      path: '/heroes',
      method: 'POST',
      options: {
        validate: {
          payload: Joi.object({
            power: Joi.string().min(3).max(100).required(),
            name: Joi.string().min(3).max(100).required()
          }),
          failAction: (request, headers, erro) => {
            throw erro
          }
        }
      },
      handler: async (request, headers) => {
        try {
          const { name, power } = request.payload;

          const result = await this.db.create({ name, power });

          return {
            message: 'Hero created with successful',
            id: result.id
          };
        } catch (error) {
          console.error(error);

          return 'Erro interno'
        }
      }
    }
  }

  update() {
    return {
      path: '/heroes/{id}',
      method: 'PATCH',
      options: {
        validate: {
          payload: Joi.object({
            power: Joi.string().min(3).max(100),
            name: Joi.string().min(3).max(100)
          }),
          params: Joi.object({
            id: Joi.string().required(),
          }),
          failAction: (request, headers, erro) => {
            throw erro
          }
        }
      },
      handler: async (request, headers) => {
        try {
          const { payload } = request;
          const { id } = request.params;

          const dadosString = JSON.stringify(payload);
          const hero = JSON.parse(dadosString);

          const result = await this.db.update(id, hero);

          console.log(result);

          if (result.modifiedCount !== 1) throw new Error('Can not updated this hero')

          return {
            message: 'Hero updated with successful'
          };
        } catch (error) {
          console.error(error);

          return 'Erro interno'
        }
      }
    }
  }
}

module.exports = HeroRoutes
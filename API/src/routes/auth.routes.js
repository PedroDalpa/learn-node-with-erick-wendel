const BaseRoutes = require('./index.routes')
const Joi = require('joi');
const Boom = require('boom');
const JWT = require('jsonwebtoken');

class AuthRoutes extends BaseRoutes {
  constructor(db) {
    super();
    this.db = db;
  }

  login() {
    return {
      path: '/login',
      method: 'POST',
      options: {
        auth: false,
        validate: {
          payload: Joi.object({
            username: Joi.string().min(3).max(100).required(),
            password: Joi.string().min(3).max(100).required()
          }),
          failAction: (request, headers, erro) => {
            throw erro
          }
        }
      },
      handler: async (request, headers) => {
        try {
          const { username, password } = request.payload;

          if (username.toLowerCase() !== 'pedrodalpa' || password !== '12345') {
            return Boom.unauthorized()
          }

          const token = JWT.sign({
            username,
            id: 1
          }, 'secret')

          return {
            token
          }

        } catch (error) {
          console.error(error);

          return Boom.internal()
        }
      }
    }
  }
}

module.exports = AuthRoutes
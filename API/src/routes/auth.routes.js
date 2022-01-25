const BaseRoutes = require('./index.routes')
const Joi = require('joi');
const Boom = require('boom');
const JWT = require('jsonwebtoken');
const PasswordHelper = require('../helpers/passwordHelper');

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

          const [user] = await this.db.read({
            username: username.toLowerCase()
          })

          if (!user) {
            return Boom.unauthorized('User or password incorrect');
          }

          const math = await PasswordHelper.comparePassword(password, user.password);

          if (!math) {
            return Boom.unauthorized('User or password incorrect');
          }

          const token = JWT.sign({
            username,
            id: user.id
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
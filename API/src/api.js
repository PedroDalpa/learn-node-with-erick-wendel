const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || "dev";
ok(env === "dev" || env === "prod", 'Invalid .env config');

const configPath = join(__dirname, '../config', `.env.${env}`);

config({
  path: configPath
});

const Hapi = require('@hapi/hapi');
const HapiJWT = require('hapi-auth-jwt2');

const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const HeroSchema = require('./db/strategies/mongodb/schemas/heroesSchema');
const HeroRoutes = require('./routes/heroes.routes');
const AuthRoutes = require('./routes/auth.routes');
const Postgres = require('./db/strategies/postgres/postgres');
const UserSchema = require('./db/strategies/postgres/schemas/userSchema');


const app = new Hapi.Server({
  port: process.env.APP_PORT
});

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]());
}

async function main() {
  const connection = MongoDB.connect();

  const context = new Context(new MongoDB(connection, HeroSchema));

  const postgresConnection = await Postgres.connect();
  const postgresModel = await Postgres.defineModel(postgresConnection, UserSchema);
  const postgresContext = new Context(new Postgres(postgresConnection, postgresModel));

  await app.register([
    HapiJWT
  ]);

  app.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET_KEY,
    validate: async (data, request) => {
      const result = await postgresContext.read({
        username: data.username,
        id: data.id
      })

      if (!result) {
        return {
          isValid: false
        }
      }

      return {
        isValid: true
      }
    }
  });

  app.auth.default('jwt');

  app.route([
    ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
    ...mapRoutes(new AuthRoutes(postgresContext), AuthRoutes.methods())
  ]);

  return app;
}

module.exports = main()
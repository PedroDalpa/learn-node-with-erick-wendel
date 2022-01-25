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
  port: 5000
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
    key: 'secret',
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

  await app.start();

  console.log('Servidor On', app.info.port);

  return app;
}

module.exports = main()
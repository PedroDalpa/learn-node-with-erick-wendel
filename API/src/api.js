const Hapi = require('@hapi/hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const HeroSchema = require('./db/strategies/mongodb/schemas/heroesSchema');
const HeroRoutes = require('./routes/heroes.routes');

const app = new Hapi.Server({
  port: 5000
});

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]());
}

async function main() {
  const connection = MongoDB.connect();

  const context = new Context(new MongoDB(connection, HeroSchema));

  app.route([
    ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods())
  ]);



  await app.start();
  console.log('Servidor On', app.info.port);

  return app;
}

module.exports = main()
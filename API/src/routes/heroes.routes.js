const BaseRoutes = require('./index.routes')


class HeroRoutes extends BaseRoutes {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/heroes',
      method: 'GET',
      handler: (request, headers) => {
        try {
          const { skip, limit, name } = request.query;
          let query = {};

          if (name) query.name = name;

          if ((isNaN(skip) && skip) || (isNaN(limit) && limit)) {
            throw new Error('Tipo invalido')
          }

          return this.db.read(query, Number(skip), Number(limit));
        } catch (error) {
          console.error(error);

          return 'Erro interno'
        }
      }
    }
  }
}

module.exports = HeroRoutes
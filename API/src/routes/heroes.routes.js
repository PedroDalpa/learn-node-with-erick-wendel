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
        return this.db.read();
      }
    }
  }
}

module.exports = HeroRoutes
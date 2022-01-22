const ICrud = require('./interfaces/ICrud');

class MongoDB extends ICrud {
  constructor() {
    super()
  }

  create(item) {
    console.log('o item foi salvo em MongoDB');
  }
}

module.exports = MongoDB
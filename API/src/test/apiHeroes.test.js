const assert = require('assert');

const api = require('../api');

let app = {};

describe.only('API Heroes Test', function () {
  this.beforeAll(async () => {
    app = await api;
  });

  it('list /heroes', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/heroes'
    });

    const dados = JSON.parse(result.payload);

    assert.deepEqual(result.statusCode, 200);
    assert.ok(Array.isArray(dados));
  })
})
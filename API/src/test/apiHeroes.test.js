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

  it('list /heroes - deve retornar somente 10 registros', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/heroes?limit=5'
    });

    const dados = JSON.parse(result.payload);

    assert.deepEqual(result.statusCode, 200);

    assert.ok(dados.length === 5);
  })

  it('list /heroes - deve retornar filtrado pelo name', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/heroes?name=Miranha'
    });

    const dados = JSON.parse(result.payload);

    assert.ok(dados.length === 1);

    assert.deepEqual(result.statusCode, 200);
  })
})
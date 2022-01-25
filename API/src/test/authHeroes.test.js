const assert = require('assert');

const api = require('../api');

let app = {};

describe('API Heroes Test', function () {
  this.beforeAll(async () => {
    app = await api;
  });

  it('Can get token /login', async () => {
    const { statusCode, result } = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'pedrodalpa',
        password: '12345'
      }
    })

    assert.deepEqual(statusCode, 200);

    assert.ok(result.token.length > 10);

  })
})
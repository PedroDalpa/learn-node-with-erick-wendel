const assert = require('assert');

const api = require('../api');
const Context = require('../db/strategies/base/contextStrategy');
const Postgres = require('../db/strategies/postgres/postgres');
const UserSchema = require('../db/strategies/postgres/schemas/userSchema');

let app = {};

const HASH = '$2b$04$JJrcy5XCHRP0xvn0djrEbuqczvUvCpIH/D5Crps5ketaEvWnLlWgO'

describe('API Heroes Test', function () {
  this.beforeAll(async () => {
    app = await api;

    const connection = await Postgres.connect();

    const model = await Postgres.defineModel(connection, UserSchema);
    const postgres = new Context(new Postgres(connection, model));

    await postgres.update(null, { username: 'pedrodalpa', password: HASH }, true);
  });

  it('Can auth user /login', async () => {
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

  it('Can not auth user invalid password /login', async () => {
    const { statusCode, result } = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'pedrodalpa',
        password: '12764'
      }
    })

    assert.deepEqual(statusCode, 401);

  })
})
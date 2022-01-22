const assert = require('assert');

const Postgres = require('../db/strategies/postgres');
const Context = require('../db/strategies/base/contextStrategy');

const context = new Context(new Postgres());

const MOCK_HERO_CREATE = { name: 'spider-man', power: 'spider sense' };

describe('Postgres Strategy', function () {

  this.beforeAll(async () => {
    await context.connect();
  });

  it('Postgres connection', async () => {

    const result = await context.isConnected();

    assert.equal(result, true);
  });

  it.only('Create hero', async () => {
    const { dataValues } = await context.create(MOCK_HERO_CREATE);

    delete dataValues.id;

    assert.deepEqual(dataValues, MOCK_HERO_CREATE);
  });
})
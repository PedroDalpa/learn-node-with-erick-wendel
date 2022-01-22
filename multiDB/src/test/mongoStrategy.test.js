const assert = require('assert');

const MongoDB = require('../db/strategies/mongodb');
const Context = require('../db/strategies/base/contextStrategy');

const context = new Context(new MongoDB());

const MOCK_HERO_CREATE = { name: 'spider-man', power: 'spider sense' };

describe('Mongo Strategy', function () {
  this.beforeAll(async () => {
    await context.connect()
  })

  it('Verify Connection', async () => {
    const result = await context.isConnected();

    assert.deepEqual(result, 1)
  });

  it.only('Create hero', async () => {
    const { name, power } = await context.create(MOCK_HERO_CREATE);

    console.log('result', { name, power });

    assert.deepEqual({ name, power }, MOCK_HERO_CREATE)
  })
})
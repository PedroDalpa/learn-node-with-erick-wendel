const assert = require('assert');

const MongoDB = require('../db/strategies/mongodb/mongodb');
const Context = require('../db/strategies/base/contextStrategy');
const HeroSchema = require('../db/strategies/mongodb/schemas/heroesSchema');

let context = {}

const MOCK_HERO_CREATE = { name: 'spider-man', power: 'spider sense' };

describe('Mongo Strategy', function () {
  this.beforeAll(async () => {
    const connection = MongoDB.connect();

    context = new Context(new MongoDB(connection, HeroSchema));
  })

  it('Verify Connection', async () => {
    const result = await context.isConnected();

    assert.deepEqual(result, 1)
  });

  it('Create hero', async () => {

    const { name, power } = await context.create(MOCK_HERO_CREATE);

    assert.deepEqual({ name, power }, MOCK_HERO_CREATE);
  })

  it('List hero', async () => {
    const [{ name, power }] = await context.read({ name: MOCK_HERO_CREATE.name });

    assert.deepEqual({ name, power }, MOCK_HERO_CREATE);
  })


  it('Update hero', async () => {
    const [{ _id }] = await context.read({ name: MOCK_HERO_CREATE.name });

    await context.update(_id, { name: 'Batman' });

    const [{ name, power }] = await context.read({ name: 'Batman' });

    assert.deepEqual({ name, power }, { name: 'Batman', power: 'spider sense' });
  });

  it('Delete hero', async () => {
    const [{ _id }] = await context.read({ name: 'Batman' });

    const result = await context.delete(_id);

    assert.deepEqual(result.deletedCount, 1);
  })
})
const assert = require('assert');

const Postgres = require('../db/strategies/postgres');
const Context = require('../db/strategies/base/contextStrategy');

const context = new Context(new Postgres());

const MOCK_HERO_CREATE = { name: 'spider-man', power: 'spider sense' };
const MOCK_HERO_UPDATE = { name: 'Iron Man', power: 'Rich' };

describe('Postgres Strategy', function () {

  this.beforeAll(async () => {
    await context.connect();
    await context.delete();
  });

  it('Postgres connection', async () => {

    const result = await context.isConnected();

    assert.equal(result, true);
  });

  it('Create hero', async () => {
    const { dataValues } = await context.create(MOCK_HERO_CREATE);

    delete dataValues.id;

    assert.deepEqual(dataValues, MOCK_HERO_CREATE);
  });

  it('List heroes', async () => {
    const [dataValues] = await context.read({ name: MOCK_HERO_CREATE.name });

    delete dataValues.id;

    assert.deepEqual(dataValues, MOCK_HERO_CREATE);
  })

  it('Update hero', async () => {
    const [dataValues] = await context.read({ name: MOCK_HERO_CREATE.name });

    await context.update(dataValues.id, { ...MOCK_HERO_UPDATE });

    const [update] = await context.read({ id: dataValues.id });

    delete update.id;

    assert.deepEqual(update, MOCK_HERO_UPDATE);
  });

  it('Remove hero', async () => {
    const [dataValues] = await context.read();

    const result = await context.delete(dataValues.id);

    assert.deepEqual(result, 1);
  });

})
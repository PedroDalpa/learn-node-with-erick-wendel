const { deepEqual, ok } = require('assert');

const database = require('../database');

const DEFAULT_ITEM_CADASTRAR = {
  name: 'flash',
  power: 'Speed',
  id: 1
}

const DEFAULT_ITEM_ATUALIZAR = {
  name: 'Batman',
  power: 'Rich',
  id: 2
}

describe('Suite de manipulação de heróis', () => {
  before(async () => {
    await database.cadastrar(DEFAULT_ITEM_CADASTRAR);
    await database.cadastrar(DEFAULT_ITEM_ATUALIZAR);
  })

  it('deve pesquisar um herói usando arquivos', async () => {
    const expected = DEFAULT_ITEM_CADASTRAR;

    const [result] = await database.listar(expected.id);

    deepEqual(result, expected);
  })


  it('deve cadastrar um herói usando arquivos', async () => {
    const expected = DEFAULT_ITEM_CADASTRAR;

    const result = await database.cadastrar(DEFAULT_ITEM_CADASTRAR);

    const [actual] = await database.listar(DEFAULT_ITEM_CADASTRAR.id);

    deepEqual(actual, expected);
  })

  it('deve remover um herói por id', async () => {
    const expected = true;

    const result = await database.remover(DEFAULT_ITEM_CADASTRAR.id);

    deepEqual(result, expected);

  })

  it('deve atualizar um herói por id', async () => {

    const expected = {
      ...DEFAULT_ITEM_ATUALIZAR,
      name: 'Lanterna verde',
      power: 'anel'
    };

    await database.atualizar(DEFAULT_ITEM_ATUALIZAR.id, {
      name: 'Lanterna verde',
      power: 'anel'
    });

    const [result] = await database.listar(DEFAULT_ITEM_ATUALIZAR.id);

    deepEqual(result, expected);

  })
})
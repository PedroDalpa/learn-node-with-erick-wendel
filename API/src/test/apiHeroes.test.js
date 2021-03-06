const assert = require('assert');

const api = require('../api');

let app = {};

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBlZHJvZGFscGEiLCJpZCI6MSwiaWF0IjoxNjQzMTI4MzQ4fQ.dsTE2w3iDcwoXBOvdKJKrcIHn1ejXtRm-6FerXVCOdw'

const headers = {
  Authorization: TOKEN
}

const DEFAULT_CREATE_HERO = {
  name: 'Pedro',
  power: 'Developer'
}

const DEFAULT_INIT_HERO = {
  name: 'Porco-Aranha',
  power: 'Porco/Aranha'
}

let DEFAULT_INIT_HERO_ID = '';

describe('API Heroes Test', function () {
  this.beforeAll(async () => {
    app = await api;

    const response = await app.inject({
      method: 'POST',
      url: '/heroes',
      headers,
      payload: DEFAULT_INIT_HERO
    });

    DEFAULT_INIT_HERO_ID = response.result.id;
  });

  it('list /heroes', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/heroes',
      headers
    });

    const dados = JSON.parse(result.payload);

    assert.deepEqual(result.statusCode, 200);
    assert.ok(Array.isArray(dados));
  })

  it('list /heroes - deve retornar somente 10 registros', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/heroes?limit=5',
      headers
    });

    const dados = JSON.parse(result.payload);

    assert.deepEqual(result.statusCode, 200);

    assert.ok(dados.length === 5);
  })

  it('list /heroes - deve retornar filtrado pelo name', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/heroes?name=Miranha',
      headers
    });

    const dados = JSON.parse(result.payload);

    assert.ok(dados.length === 1);

    assert.deepEqual(result.statusCode, 200);
  })

  it('create /heroes', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/heroes',
      payload: DEFAULT_CREATE_HERO,
      headers
    });

    const { message, id } = response.result

    assert.deepEqual(response.statusCode, 200);
    assert.notStrictEqual(id, undefined)
    assert.deepEqual(message, 'Hero created with successful');
  })

  it('update /heroes/:id', async () => {
    const expected = {
      power: 'Metade aranha metade porco'
    }

    const response = await app.inject({
      method: 'PATCH',
      url: `/heroes/${DEFAULT_INIT_HERO_ID}`,
      payload: expected,
      headers
    });

    const { message } = response.result;

    assert.deepEqual(response.statusCode, 200);

    assert.deepEqual(message, 'Hero updated with successful');

  })

  it('delete /heroes/:id', async () => {

    const response = await app.inject({
      method: 'DELETE',
      url: `/heroes/${DEFAULT_INIT_HERO_ID}`,
      headers
    });

    const { message } = response.result;

    assert.deepEqual(response.statusCode, 200);

    assert.deepEqual(message, 'Hero deleted with successful');

  })
})
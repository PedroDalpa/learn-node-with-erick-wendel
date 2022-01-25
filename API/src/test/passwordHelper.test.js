const assert = require('assert');

const PasswordHelper = require('../helpers/passwordHelper');

const HASH = '$2b$04$JJrcy5XCHRP0xvn0djrEbuqczvUvCpIH/D5Crps5ketaEvWnLlWgO';

describe('User helper Test', function () {
  it('can generate hash from password', async () => {
    const response = await PasswordHelper.hashPassword('12345');

    assert.ok(response.length > 10);
  })

  it('can validate password from hash', async () => {
    const response = await PasswordHelper.comparePassword('12345', HASH);

    assert.ok(response);
  })
})
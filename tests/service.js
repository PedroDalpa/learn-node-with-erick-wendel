const { get } = require('axios');

const URL = `https://swapi.dev/api/people`;

async function getPeople(name) {
  const url = `${URL}/?search=${name}&format=json`

  const { data } = await get(url);
  console.log(data);
  return data.results.map(item => formatPeople(item));
}

function formatPeople(item) {
  console.log(item);
  return {
    name: item.name,
    height: item.height
  }
}

module.exports = {
  getPeople
}
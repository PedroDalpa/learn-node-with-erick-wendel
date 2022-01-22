const service = require('./service');

async function runFors() {
  try {
    const result = await service.getPeople('a');
    const name = [];

    console.time('for')
    for (let index = 0; index < result.results.length - 1; index++) {
      const people = result.results[index];

      name.push(people.name);

    }
    console.timeEnd('for')

    console.time('forin')
    for (let i in result.results) {
      const people = result.results[i];

      name.push(people.name)
    }
    console.timeEnd('forin')

    console.time('forof')
    for (people of result.results) {
      name.push(people.name)
    }
    console.timeEnd('forof')

    console.log('name', name);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  runFors
}
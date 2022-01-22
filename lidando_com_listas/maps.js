const service = require('./service');
const runFors = require('./fors')
async function main() {
  try {
    await runFors.runFors()

    const result = await service.getPeople('a');

    const namesFor = [];

    console.time('foreach');

    result.results.forEach(element => {
      namesFor.push(element.name);
    });

    console.timeEnd('foreach');
    console.time('map');
    const names = result.results.map((people) => {
      return people.name
    })
    console.timeEnd('map');

    console.log(names, namesFor);
  } catch (error) {
    console.error(error);
  }
}

main()

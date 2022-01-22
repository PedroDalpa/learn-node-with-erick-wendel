const { getPeople } = require('./service');

Array.prototype.myFilter = function (callback) {
  const list = [];
  for (index in this) {
    const item = this[index];
    const result = callback(item, index, this);
    if (!result) continue;

    list.push(item);

  }

  return list
}

async function main() {
  try {
    const { results } = await getPeople('a');

    // const filterFamily = results.filter((item) => {
    //   const result = item.name.toLowerCase().indexOf('lars') !== -1

    //   return result
    // });

    const filterFamily = results.myFilter((item, index, list) =>
      item.name.toLowerCase().indexOf('lars') !== -1
    );

    const names = filterFamily.map((people) => people.name)

    console.log(names);

  } catch (error) {
    console.error(error);
  }

}

main()
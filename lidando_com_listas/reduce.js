const { getPeople } = require('./service');

Array.prototype.myReduce = function (callback, valorInicial) {
  let total = typeof valorInicial !== undefined ? valorInicial : this[0];

  for (let index = 0; index < this.length; index++) {
    total = callback(total, this[index], this);
  }

  return total
}

async function main() {
  try {
    const { results } = await getPeople('a');

    const heights = results.map(item => Number(item.height));

    // const total = heights.reduce((previous, next) => {
    //   return previous + next
    // }, 0);

    const myList = [
      ['1', '2'],
      ['3', 4]
    ]

    const total = myList.myReduce((previous, next) => {
      return previous.concat(next);
    }, []).join(', ')

    console.log(total, 'heights');
  } catch (error) {
    console.error(error);
  }
}

main();
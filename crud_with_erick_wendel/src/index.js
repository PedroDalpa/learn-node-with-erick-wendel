const { Command } = require('commander');

const database = require('./database');
const Heroi = require('./heroi');

async function main() {
  const program = new Command();

  program
    .version('v1')
    .option('-n, --name [value]', 'Nome do herói')
    .option('-p, --power [value]', 'Poder do herói')
    .option('-c, --create', 'Cadastrar herói')
    .option('-l, --list', 'Listar heróis')
    .option('-r, --remove', 'Remover um herói por ID')
    .option('-i, --id [value]', 'Id do herói')
    .option('-u, --update [value]', 'Atualizar herói pelo ID')
    .parse(process.argv);

  const heroi = new Heroi(program._optionValues)

  try {
    if (program._optionValues.create) {
      delete heroi.id
      const result = await database.cadastrar(heroi);

      if (!result) {
        console.error('Herói nao foi cadastrado');
        return
      }
      console.log('Herói cadastrado', result);
    }

    if (program._optionValues.list) {
      const result = await database.listar();

      if (!result) {
        console.error('error');
        return
      }
      console.log('Heróis cadastrados', result);
    }

    if (program._optionValues.remove) {
      const result = await database.remover(heroi.id);

      if (!result) {
        console.error('error');
        return
      }
      console.log('Heróis removido', result);
    }

    if (program._optionValues.update) {
      const id = Number(program._optionValues.update);

      delete heroi.id

      const result = await database.atualizar(id, JSON.parse(JSON.stringify(heroi)));

      if (!result) {
        console.error('error');
        return
      }
      console.log('Heróis atualizado', result);
    }
  } catch (error) {
    console.error('Deu ruim', error);
  }
}

main()
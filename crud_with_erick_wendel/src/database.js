const { readFile, writeFile } = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile)

class Database {
  constructor() {
    this.NOME_ARQUIVO = 'src/herois.json';
  }

  async obterDadosArquivo() {

    const arquivo = await readFileAsync(this.NOME_ARQUIVO, 'utf-8');
    return JSON.parse(arquivo.toString())
  }

  async escreverArquivo(dados) {
    await writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados));

    return true
  }

  async cadastrar(heroi) {
    const dados = await this.obterDadosArquivo();

    const id = heroi.id <= 2 ? heroi.id : Date.now();

    const heroiComId = { id, ...heroi };


    const dadosFinal = [
      ...dados,
      heroiComId,
    ];

    const result = await this.escreverArquivo(dadosFinal);

    return result;
  }

  async listar(id) {
    const dados = await this.obterDadosArquivo();

    const dadosFiltrados = dados.filter(item => (id ? (item.id === id) : true));

    return dadosFiltrados
  }

  async remover(id) {
    if (!id) {
      return await this.escreverArquivo([])
    }

    const dados = await this.obterDadosArquivo();

    const indice = dados.findIndex(item => item.id === Number(id));

    if (indice === -1) {
      throw new Error('O herói passado nao existe');
    }

    dados.splice(indice, 1);

    return await this.escreverArquivo(dados)
  }

  async atualizar(id, dados) {
    const herois = await this.obterDadosArquivo();

    const index = herois.findIndex(item => item.id === Number(id))

    if (index === -1) {
      throw Error('O herói informando não existe');
    }

    const atual = herois[index];

    herois.splice(index, 1);


    return await this.escreverArquivo([
      ...herois,
      {
        ...atual,
        ...dados
      }
    ])
  }
}

module.exports = new Database()
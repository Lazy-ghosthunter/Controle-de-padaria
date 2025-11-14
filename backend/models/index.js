const db = require('./db');

// Importa modelos (arquivos existentes em ./models)
const Bairro = require('./Bairro');
const Cidade = require('./Cidade');
const Cliente = require('./Cliente');
const Endereco = require('./Endereco');
const Funcionario = require('./Funcionario');
const Item_venda = require('./Item_venda');
const Produto = require('./Produto');
const Venda = require('./Venda');

// Lookups agrupados (UF, Tipo_produto, Pagamento, Status, Cargo)
const lookups = require('./lookups');

// Exporta sequelize/Sequelize e todos os modelos
module.exports = {
  Sequelize: db.Sequelize,
  sequelize: db.sequelize,
  Bairro,
  Cidade,
  Cliente,
  Endereco,
  Funcionario,
  Item_venda,
  Produto,
  Venda,
  ...lookups,
};

const models = require('./models');

const ufs = [
  'AC - Acre','AL - Alagoas','AP - Amapá','AM - Amazonas','BA - Bahia','CE - Ceará',
  'DF - Distrito Federal','ES - Espírito Santo','GO - Goiás','MA - Maranhão',
  'MT - Mato Grosso','MS - Mato Grosso do Sul','MG - Minas Gerais','PA - Pará',
  'PB - Paraíba','PR - Paraná','PE - Pernambuco','PI - Piauí','RJ - Rio de Janeiro',
  'RN - Rio Grande do Norte','RS - Rio Grande do Sul','RO - Rondônia','RR - Roraima',
  'SC - Santa Catarina','SP - São Paulo','SE - Sergipe','TO - Tocantins'
];

const tipoProdutos = [
  'Pães','Salgados','Doces','Bebidas','Bebidas alcoólicas','Folheados','Confeitados'
];

const cargos = [
  'Atendente','Caixa','Padeiro','Auxiliar de Padeiro','Confeiteiro','Gerente','Entregador','Estoquista','Faxineiro'
];

const statusList = ['bom','médio','ruim'];

const tiposPagamento = ['Crédito', 'Cartão de crédito', 'Débito', 'Pix', 'Dinheiro', 'VR', 'VA'];



async function upsertLookups() {
  try {

    // não executar sync aqui — assume que o servidor já sincronizou/tem as tabelas
    if (!models.UF || !models.Tipo_produto || !models.Cargo || !models.Status || !models.Pagamento) {
      console.error('Alguns modelos de lookup não foram encontrados em ./models. Verifique exports em models/index.js');
      process.exit(1);
    }

    console.log('Inserindo tipos de pagamento...');
    for (const desc of tiposPagamento) {
      await models.Pagamento.findOrCreate({ where: { desc_tipo: desc } });
    }

    /*
    console.log('Inserindo UFs...');
    for (const nome of ufs) {
      await models.UF.findOrCreate({ where: { nome_UF: nome } });
    }

    console.log('Inserindo tipos de produto...');
    for (const desc of tipoProdutos) {
      await models.Tipo_produto.findOrCreate({ where: { desc_tipo: desc } });
    }

    console.log('Inserindo cargos...');
    for (const desc of cargos) {
      await models.Cargo.findOrCreate({ where: { desc_cargo: desc } });
    }

    console.log('Inserindo status...');
    for (const s of statusList) {
      await models.Status.findOrCreate({ where: { desc: s } });
    } 
    */
    

    console.log('Inserções concluídas.');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao popular lookups:', err);
    process.exit(1);
  }
}

upsertLookups();

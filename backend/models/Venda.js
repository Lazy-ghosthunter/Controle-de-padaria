const db = require("./db");
const Venda = db.sequelize.define(
  "Venda",
  {
    cod_venda: {
      type: db.Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    data_Venda: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    fk_responsavel: {
      type: db.Sequelize.INTEGER,
      references: { model: "Funcionario", key: "cpf_funcionario" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    fk_tipoPagamento: {
      type: db.Sequelize.INTEGER,
      references: { model: "Pagamento", key: "id_tipoPag" },
      onDelete: "CASCADE",
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Venda.sync({ force: true });
Module.exports = Venda;

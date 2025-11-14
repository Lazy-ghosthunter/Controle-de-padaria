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
      defaultValue: db.Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    fk_responsavel: {
      type: db.Sequelize.INTEGER,
      references: { model: "funcionario", key: "cpf_funcionario" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    fk_tipoPagamento: {
      type: db.Sequelize.INTEGER,
      references: { model: "Pagamento", key: "id_tipo" },
      onDelete: "CASCADE",
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

module.exports = Venda;

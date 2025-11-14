const db = require("./db");

const Item_venda = db.sequelize.define(
  "ItemVenda",
  {
    cod_ItemVenda: {
      type: db.Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    fk_codVenda: {
      type: db.Sequelize.INTEGER,
      references: { model: "Venda", key: "cod_venda" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    fk_codProduto: {
      type: db.Sequelize.INTEGER,
      references: { model: "Produto", key: "cod_produto" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    quantidade:{
        type: db.Sequelize.INTEGER
    }
  },
  { freezeTableName: true }
);

Item_venda.sync({ force: true });
module.exports = Item_venda;

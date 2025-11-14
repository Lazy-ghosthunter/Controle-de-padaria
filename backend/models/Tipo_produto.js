const db = require('./db');
const Tipo_produto = db.sequelize.define('tipo_produto',{

    id_tipo:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    desc_tipo: {
        type: db.Sequelize.TEXT
    }
}, {freezeTableName: true});

Tipo_produto.sync({force: true});
Module.exports = Tipo_produto;
const db = require('./db');
const Cidade = db.sequelize.define('cidade',{

    id_Cidade:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    nome_cidade: {
        type: db.Sequelize.TEXT
    }

}, {freezeTableName: true});

Cidade.sync({force:true});
Module.exports = Cidade;
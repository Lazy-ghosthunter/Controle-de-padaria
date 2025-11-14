const db = require('./db');
const Bairro = db.sequelize.define('bairro',{

    id_Bairro:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    nome_bairro: {
        type: db.Sequelize.TEXT
    }

}, {freezeTableName: true});

Bairro.sync({force:true});
module.exports = Bairro;
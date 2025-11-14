const db = require('./db');
const Cliente = db.sequelize.define('cliente',{

    cod_cliente:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    nome: {
        type: db.Sequelize.TEXT
    },
    fk_endereco:{
        type:db.Sequelize.INTEGER,
        references:{model: 'Endereco', key:'id_endereco'},
        onDelete: 'CASCADE',
        allowNull: false,
    },
    credito:{
        type: db.Sequelize.DECIMAL(10,2)
    }

}, {freezeTableName: true});

Cliente.sync({force:true});
Module.exports = Cliente;
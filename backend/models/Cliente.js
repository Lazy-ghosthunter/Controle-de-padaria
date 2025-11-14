const db = require('./db');
const Cliente = db.sequelize.define('cliente',{

    cpf_cliente:{
        type: db.Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true
    },
    nome: {
        type: db.Sequelize.TEXT
    },
    fk_endereco:{
        type:db.Sequelize.INTEGER,
        references:{model: 'endereco', key:'id_Endereco'},
        onDelete: 'CASCADE',
        allowNull: false,
    },
    status:{
        type:db.Sequelize.INTEGER,
        references:{model: 'Status', key:'id_status'},
        onDelete: 'CASCADE',
        allowNull: false,
    },
    credito:{
        type: db.Sequelize.DECIMAL(10,2)
    }

}, {freezeTableName: true});

module.exports = Cliente;
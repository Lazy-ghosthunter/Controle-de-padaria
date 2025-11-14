const db = require('./db');
const Funcionario = db.sequelize.define('funcionario',{

    cpf_funcionario:{
        type: db.Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true
    },
    nome: {
        type: db.Sequelize.TEXT
    },
    fk_cargo:{
        type:db.Sequelize.INTEGER,
        references:{model: 'cargo', key:'id_cargo'},
        onDelete: 'CASCADE',
        allowNull: false,
    }
}, {freezeTableName: true});

module.exports = Funcionario;
const db = require('./db');
const Funcionario = db.sequelize.define('funcionario',{

    cod_funcionario:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    nome: {
        type: db.Sequelize.TEXT
    },
    fk_cargo:{
        type:db.Sequelize.INTEGER,
        references:{model: 'Cargo', key:'id_cargo'},
        onDelete: 'CASCADE',
        allowNull: false,
    }
}, {freezeTableName: true});

Funcionario.sync({force:true});
Module.exports = Funcionario;
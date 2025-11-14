const db = require('./db');
const Endereco = db.sequelize.define('endereco',{

    id_Endereco:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    cep: {
        type: db.Sequelize.TEXT
    },
    numero:{
        type: db.Sequelize.INTEGER
    },
    complemento:{
        type: db.Sequelize.TEXT
    },
    fk_Bairro:{
        type:db.Sequelize.INTEGER,
        references:{model: 'Bairro', key:'id_bairro'},
        onDelete: 'CASCADE',
        allowNull: false,
    },
    fk_Cidade:{
        type:db.Sequelize.INTEGER,
        references:{model: 'Cidade', key:'id_Cidade'},
        onDelete: 'CASCADE',
        allowNull: false,
    },
    fk_UF:{
        type:db.Sequelize.INTEGER,
        references:{model: 'UF', key:'id_UF'},
        onDelete: 'CASCADE',
        allowNull: false,
    }

}, {freezeTableName: true});

Endereco.sync({force:true});
module.exports = Endereco;

/*
id_endereco
cep
logradouro 
numero
complemento
bairro
cidade
estado (UF)
*/
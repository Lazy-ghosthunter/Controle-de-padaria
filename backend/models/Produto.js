const db = require('./db');
const Produto = db.sequelize.define('produto',{

    cod_produto:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    nome: {
        type: db.Sequelize.TEXT
    },
    un_medida:{
        type: db.Sequelize.TEXT
    },
    preco:{
        type: db.Sequelize.DECIMAL(10,2)
    },
    fk_tipo:{
        type:db.Sequelize.INTEGER,
        references:{model: 'tipo_produto', key:'id_tipo'},
        onDelete: 'CASCADE',
        allowNull: false,
    }
}, {freezeTableName: true});

Produto.sync({force:true})
module.exports = Produto;


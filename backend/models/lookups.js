const db = require('./db');

//! UFs ----------------------------------------------------------------
const UF = db.sequelize.define('UF',{

    id_UF:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    nome_UF: {
        type: db.Sequelize.TEXT
    }

}, {freezeTableName: true});


//! tipos de produto --------------------------------------------------
const Tipo_produto = db.sequelize.define('tipoProduto',{

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


//! tipos de pagamento --------------------------------------------------
const Pagamento = db.sequelize.define('Pagamento',{

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


//! Status --------------------------------------------------
const Status = db.sequelize.define('Status',{

    id_status:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    desc: {
        type: db.Sequelize.TEXT
    }
}, {freezeTableName: true});


//! Cargo --------------------------------------------------
const Cargo = db.sequelize.define('cargo',{

    id_cargo:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    desc_cargo: {
        type: db.Sequelize.TEXT
    }
}, {freezeTableName: true});


module.exports = {UF, Tipo_produto, Pagamento, Status, Cargo};
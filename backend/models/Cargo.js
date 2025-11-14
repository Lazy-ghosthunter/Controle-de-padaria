const db = require('./db');
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

Cargo.sync({force: true});
Module.exports = Cargo;
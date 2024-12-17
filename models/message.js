const Sequelize = require('sequelize');

const sequelize= require('../config/database.js');

const Message =sequelize.define('message', {
    id: {type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull: false,
    },
    body:{type:Sequelize.STRING,
        allowNull:false
    },
    createdAt:{
        type:Sequelize.DATE,
        default:Date.now()
    },
    editedAt:{
        type:Sequelize.DATE,
        

    },
    

})

module.exports = Message;

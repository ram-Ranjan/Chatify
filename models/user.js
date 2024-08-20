
const sequelize = require('../config/database');

const Datatypes = require('sequelize');

const User = sequelize.define("user",
   {
    id:{
        type:Datatypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    username:{
       type: Datatypes.STRING,
       allowNull: false,
    },
    email:{
        type: Datatypes.STRING,
        allowNull:false
     },
     password:{
      type: Datatypes.STRING,
      allowNull:false
   },
     phone:{
        type: Datatypes.STRING,
        allowNull:false,
     },
},{
    timestamps:false
});

module.exports = User;


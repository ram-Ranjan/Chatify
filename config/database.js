
const dotenv = require('dotenv');
dotenv.config();
const Sequelize = require('sequelize');


const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
    host:process.env.HOSTNAME,
    dialect:'postgres'

});

module.exports = sequelize;
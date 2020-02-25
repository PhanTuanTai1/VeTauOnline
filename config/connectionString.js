const { Sequelize, Model, DataTypes } = require('sequelize');
var sequelize = new Sequelize('TrainTicketDatabase', 'sa', '79495291', {
    dialect: 'mssql',
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      }
    }
})

module.exports.ConnectDB = sequelize;